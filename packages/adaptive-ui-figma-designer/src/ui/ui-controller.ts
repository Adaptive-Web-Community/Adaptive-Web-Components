import { calc } from '@csstools/css-calc';
import { parseColorHexARGB } from "@microsoft/fast-colors";
import { FASTElement } from "@microsoft/fast-element";
import { CSSDesignToken, type ValuesOf } from "@microsoft/fast-foundation";
import { InteractiveTokenGroup, StyleProperty, Styles, SwatchRGB } from "@adaptive-web/adaptive-ui";
import { fillColor } from "@adaptive-web/adaptive-ui/reference";
import { AppliedDesignToken, AppliedStyleModules, AppliedStyleValue, PluginUINodeData, TOOL_PARENT_FILL_COLOR } from "../core/model.js";
import { DesignTokenRegistry } from "../core/registry/design-token-registry.js";
import { registerAppliableTokens, registerTokens } from "../core/registry/recipes.js";
import { ElementsController } from "./ui-controller-elements.js";
import { StylesController } from "./ui-controller-styles.js";
import { DesignTokenController } from "./ui-controller-tokens.js";

/**
 * The source of an applied design token.
 * Used to determine which values to persist (and to ease debugging).
 */
const AppliedTokenSource = {
    /**
     * 1st - Component style modules.
     */
    componentModules: "componentModules",

    /**
     * 2nd - Component local individual styles or module overrides.
     */
    component: "component",

    /**
     * 3rd - Local style modules.
     */
    localModules: "localModules",

    /**
     * 4th - Local individual styles or module overrides.
     */
    local: "local",
} as const;

/**
 * The source of an applied design token.
 * Used to determine which values to persist (and to ease debugging).
 */
type AppliedTokenSource = ValuesOf<typeof AppliedTokenSource>;

/**
 * Information about an applied design token, used to evaluate and apply the value.
 */
type AppliedStyleValueInfo = {
    value: string | CSSDesignToken<any>;
    source: AppliedTokenSource;
}

/**
 * The Controller for the UI side of the plugin, which encapsulates the business logic of
 * setting or applying design tokens and evaluating the changes for the selected nodes.
 */
export class UIController {
    private readonly _updateStateCallback: (
        selectedNodes: PluginUINodeData[]
    ) => void | undefined;

    /**
     * A sub-controller responsible for node element mapping.
     *
     * Note that this is considered an internal implementation detail and is not exposed as the API of the controller.
     */
    private readonly _elements: ElementsController;

    /**
     * A sub-controller responsible for managing design tokens.
     */
    public readonly designTokens: DesignTokenController;

    /**
     * A sub-controller responsible for managing applied styles.
     */
    public readonly styles: StylesController;

    // This is adapting the new token model to the previous plugin structure.
    // What was previously a "recipe" is now an "applied design token".
    // The separation is useful for now in that "setting" a token is for overriding a value at a node,
    // and "applying" a token is using it for some visual element.
    public readonly designTokenRegistry: DesignTokenRegistry = new DesignTokenRegistry();
    public readonly appliableDesignTokenRegistry: DesignTokenRegistry = new DesignTokenRegistry();

    private _selectedNodes: PluginUINodeData[] = [];

    /**
     * Create a new UI controller.
     *
     * @param updateStateCallback - Callback function to handle updated design token evaluation
     */
    constructor(updateStateCallback: (selectedNodes: PluginUINodeData[]) => void) {
        this._updateStateCallback = updateStateCallback;

        this._elements = new ElementsController(this);
        this.designTokens = new DesignTokenController(this, this._elements);
        this.styles = new StylesController(this);

        registerTokens(this.designTokenRegistry);
        registerAppliableTokens(this.appliableDesignTokenRegistry);
    }

    /**
     * Sets the selected nodes, which sets up the UI and immediately refreshes all design token evaluations.
     *
     * @param nodes - The selected nodes
     */
    public set selectedNodes(nodes: PluginUINodeData[]) {
        // console.log("--------------------------------");
        // console.log("UIController.set_selectedNodes", nodes);

        this._selectedNodes = nodes;

        this._elements.selectedNodesChanged();

        if (this.autoRefresh) {
            this.refreshSelectedNodes("set_selectedNodes");
        }

        this.designTokens.selectedNodesChanged();
    }

    /**
     * Gets the selected nodes.
     */
    public get selectedNodes(): PluginUINodeData[] {
        return this._selectedNodes;
    }

    /**
     * Whether the designer will auto refresh the selected nodes when the selection changes.
     */
    public get autoRefresh(): boolean {
        return !(
            this._selectedNodes.length === 1 && this._selectedNodes[0].type === "PAGE"
        );
    }

    /**
     * Reevaluates the styles for the selected nodes.
     *
     * @param reason - A description used for debug logging
     */
    public refreshSelectedNodes(reason: string = "refreshSelectedNodes"): void {
        // console.log("  Evaluating all design tokens for all selected nodes");
        this.evaluateEffectiveAppliedStyleValues(this._selectedNodes);

        this.dispatchState(reason);
    }

    /**
     * Gets whether the selected nodes support the requested style target type.
     *
     * @param target - The style property target
     * @returns Whether the selected nodes support the requested style target type
     */
    public supports(target: StyleProperty): boolean {
        return this._selectedNodes.some(node => node.supports.includes(target));
    }

    /**
     * Resets all design tokens and styles for the selected nodes.
     */
    public resetNodes(): void {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("UIController.resetNodes", node);

            node.designTokens.clear();
            node.appliedStyleModules = new AppliedStyleModules();
            node.appliedDesignTokens.clear();
        });

        this.refreshSelectedNodes("resetNodes");
    }

    /**
     * Reduces the effective set of applied design tokens or values from the various sources.
     *
     * @param node - The plugin UI node data
     * @returns The effective set of applied styles by target property
     */
    private collectEffectiveAppliedStyles(node: PluginUINodeData): Map<StyleProperty, AppliedStyleValueInfo> {
        const allApplied = new Map<StyleProperty, AppliedStyleValueInfo>();

        const registry = this.appliableDesignTokenRegistry;
        function appliedDesignTokensHandler(source: AppliedTokenSource): (applied: AppliedDesignToken, target: StyleProperty) => void {
            return function(applied, target) {
                const token = registry.get(applied.tokenID);
                if (token) {
                    allApplied.set(target, {
                        value: token.token as CSSDesignToken<any>,
                        source,
                    });
                } else {
                    console.error("Token not found:", applied.tokenID);
                }
            }
        }

        function appliedStyleModulesHandler(source: AppliedTokenSource): (moduleID: string) => void {
            return function(moduleID: string) {
                const styles = Styles.Shared.get(moduleID);
                if (!styles) {
                    console.error(`Style module not found: ${moduleID}`);
                    return;
                }
                styles.effectiveProperties.forEach((value, target) => {
                    // TODO: Support other properties.
                    if (value instanceof CSSDesignToken) {
                        // console.log("    applying token >", value);
                        allApplied.set(target, {
                            value,
                            source,
                        });
                    } else if (typeof value === "string") {
                        // console.log("    applying string >", value);
                        allApplied.set(target, {
                            value,
                            source,
                        });
                    } else {
                        const group = (value as InteractiveTokenGroup<any>);
                        if (group && group.rest) {
                            // console.log("    applying group >", group);
                            allApplied.set(target, {
                                value: group.rest,
                                source,
                            });
                        } else {
                            console.warn("    token type not supported >", typeof value, value);
                        }
                    }
                });
            }
        }

        node.componentAppliedStyleModules.forEach(appliedStyleModulesHandler(AppliedTokenSource.componentModules));
        node.componentAppliedDesignTokens.forEach(appliedDesignTokensHandler(AppliedTokenSource.component));
        node.appliedStyleModules.forEach(appliedStyleModulesHandler(AppliedTokenSource.localModules));
        node.appliedDesignTokens.forEach(appliedDesignTokensHandler(AppliedTokenSource.local));

        return allApplied;
    }

    private evaluateEffectiveAppliedStyleValues(nodes: PluginUINodeData[]) {
        // console.log("evaluateEffectiveAppliedStyleValues", nodes.length, nodes);
        nodes.forEach(node => {
            // console.log("  evaluateEffectiveAppliedStyleValues", node);

            // See `evaluateEffectiveAppliedDesignToken` for a note on this.
            const colorHex = node.additionalData.get(TOOL_PARENT_FILL_COLOR);
            if (colorHex) {
                const parentElement = this._elements.getElementForNode(node).parentElement as FASTElement;
                const color = parseColorHexARGB(colorHex);
                // console.log("    setting fill color token on parent element", color, color?.toStringHexARGB(), parentElement.id);
                this._elements.setDesignTokenForElement(parentElement, fillColor, SwatchRGB.from(color));
            }

            const allApplied = this.collectEffectiveAppliedStyles(node);
            allApplied.forEach((info, target) => {
                if (info.value) {
                    if (typeof info.value === "string") {
                        // console.log("    evaluateEffectiveAppliedStyleValues", target, " : ", "string", " -> ", info.value, `(from ${info.source})`);
                        const applied = new AppliedStyleValue(info.value);
                        node.effectiveAppliedStyleValues.set(target, applied);
                    } else {
                        this.evaluateEffectiveAppliedDesignToken(target, info.value, node, info.source);
                    }
                } else {
                    console.warn("Token not found in appliable tokens", info.source);
                }
            });

            // console.log("      evaluations", node.effectiveAppliedStyleValues);

            if (node.children.length > 0) {
                this.evaluateEffectiveAppliedStyleValues(node.children);
            }
        });
    }

    private evaluateEffectiveAppliedDesignToken(target: StyleProperty, token: CSSDesignToken<any>, node: PluginUINodeData, source: AppliedTokenSource) {
        const valueOriginal: any = this._elements.getDesignTokenValue(node, token);
        let value: any = valueOriginal;
        // let valueDebug: any;
        if (valueOriginal instanceof SwatchRGB) {
            const swatch = valueOriginal as SwatchRGB;
            value = swatch.color.toStringHexARGB();
            // valueDebug = swatch;
        } else if (typeof valueOriginal === "string") {
            if (valueOriginal.startsWith("calc")) {
                const ret = calc(valueOriginal as string);
                // console.log(`    calc ${value} returns ${ret}`);
                value = ret;
            }
        }
        // console.log("    evaluateEffectiveAppliedDesignToken", target, " : ", token.name, " -> ", value, valueDebug, `(from ${source})`);

        const applied = new AppliedStyleValue(value);
        node.effectiveAppliedStyleValues.set(target, applied);

        if (source === AppliedTokenSource.local) {
            const appliedToken = new AppliedDesignToken(token.name, value);
            node.appliedDesignTokens.set(target, appliedToken);
        }

        // This is necessary for representing nested elements in Figma, but does not realistically represent the way the tokens work.
        // - A node will come in with the paren't fill color provided in `additionalData`. This accounts for relative color recipes,
        //   but addressed the fact only selected nodes are processed going down the hierarchy.
        // - If this node calculates a new background fill we need to update that value.
        // - See `evaluateEffectiveAppliedStyleValues` where this value is set as a design token value.
        // 
        // This is perhaps still the most indirect interaction in Adaptive UI, where most color recipes are based on a container fill,
        // but there's no way to resolve the _container_ color, so the color has to be on the _child_ node.
        // This is further complicated by the fact that token values can only be set at the component level, not for a child element.
        // This is also one of the primary motivations of the style modules and the creation of background/foreground color sets, because
        // the foreground can be evaluated in the context of the background color, removing the reliance on the `fill-color` token.
        if (target === StyleProperty.backgroundFill) {
            if (node.children.length > 0) {
                // console.log(`        Setting '${TOOL_PARENT_FILL_COLOR}' additional data on children`, value, valueOriginal);
                node.children.forEach(child => {
                    // console.log("          Child", child.id, child.name);
                    child.additionalData.set(TOOL_PARENT_FILL_COLOR, value);
                });
            }
        }
    }

    private dispatchState(reason: string): void {
        // console.log("UIController.dispatchState", reason);
        this._updateStateCallback(this._selectedNodes);
    }
}
