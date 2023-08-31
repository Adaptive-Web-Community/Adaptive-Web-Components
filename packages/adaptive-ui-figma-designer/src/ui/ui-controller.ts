import { InteractiveTokenGroup, StyleProperty, Styles, SwatchRGB } from "@adaptive-web/adaptive-ui";
import { calc } from '@csstools/css-calc';
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { customElement, FASTElement, html, observable } from "@microsoft/fast-element";
import { CSSDesignToken, type DesignToken, type StaticDesignTokenValue, type ValuesOf } from "@microsoft/fast-foundation";
import { AppliedDesignToken, AppliedStyleValue, DesignTokenValue, PluginUINodeData, TOOL_FILL_COLOR_TOKEN } from "../core/model.js";
import { DesignTokenDefinition, DesignTokenRegistry } from "../core/registry/design-token-registry.js";
import { nameToTitle, registerAppliableTokens, registerTokens } from "../core/registry/recipes.js";

/**
 * Simple display information for representing design tokens applied to one or more Nodes.
 */
export interface UIDesignTokenValue {
    /**
     * The definition of the design token.
     */
    definition: DesignTokenDefinition;

    /**
     * Represents the design token value if all selected nodes have the same value.
     */
    value: string;

    /**
     * If the selected nodes have multiple different values this will be a list for display.
     */
    multipleValues?: string;
}

/**
 * Display definition for a single style module.
 */
export type StyleModuleDisplay = {
    name: string;
    title: string;
}

/**
 * A list of style modules grouped by the single top-level group name.
 */
export type StyleModuleDisplayList = Map<string, StyleModuleDisplay[]>;

@customElement({
    name: `plugin-design-system-provider`,
    template: html`
        <slot></slot>
    `,
})
class DesignSystemProvider extends FASTElement {}

export interface AppliedDesignTokenItem {
    target: StyleProperty;
    tokenID: string;
    value: string;
}

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

    // This is adapting the new token model to the previous plugin structure.
    // What was previously a "recipe" is now an "applied design token".
    // The separation is useful for now in that "setting" a token is for overriding a value at a node,
    // and "applying" a token is using it for some visual element.
    private readonly _designTokenRegistry: DesignTokenRegistry = new DesignTokenRegistry();
    private readonly _appliableDesignTokenRegistry: DesignTokenRegistry = new DesignTokenRegistry();

    /**
     * The container for the elements created for each node so we can resolve values from the Design Token infrastructure.
     * We don't need to set values for every design token because for we'll get the token's withDefault value.
     */
    private readonly _rootElement: DesignSystemProvider;

    private _selectedNodes: PluginUINodeData[] = [];

    @observable
    public designTokenValues: UIDesignTokenValue[] | null;

    @observable
    public availableDesignTokens: DesignTokenDefinition[] | null;

    /**
     * Create a new UI controller.
     * @param updateStateCallback Callback function to handle updated design token evaluation.
     */
    constructor(updateStateCallback: (selectedNodes: PluginUINodeData[]) => void) {
        this._updateStateCallback = updateStateCallback;

        registerTokens(this._designTokenRegistry);
        registerAppliableTokens(this._appliableDesignTokenRegistry);

        this._rootElement = document.createElement(
            "plugin-design-system-provider"
        ) as DesignSystemProvider;
        this._rootElement.id = "designTokenRoot";
        document.body.appendChild(this._rootElement);
    }

    public get autoRefresh(): boolean {
        return !(
            this._selectedNodes.length === 1 && this._selectedNodes[0].type === "PAGE"
        );
    }

    /**
     * Sets the selected nodes, which sets up the UI and immediately refreshes all design token evaluations.
     * @param nodes The selected nodes.
     */
    public setSelectedNodes(nodes: PluginUINodeData[]) {
        // console.log("--------------------------------");
        // console.log("UIController.setSelectedNodes", nodes);

        this._selectedNodes = nodes;

        this._rootElement.childNodes.forEach(child =>
            this._rootElement.removeChild(child)
        );
        nodes.forEach(node => this.setupDesignTokenElement(this._rootElement, node));

        if (this.autoRefresh) {
            this.refreshSelectedNodes("setSelectedNodes");
        }

        this.setupDesignTokenObservables();
    }

    public refreshSelectedNodes(reason: string = "refreshSelectedNodes"): void {
        this.evaluateEffectiveAppliedStyleValues(this._selectedNodes);

        this.dispatchState(reason);
    }

    private styleModuleSort(a: [string, Styles], b: [string, Styles]): number {
        return a[0].localeCompare(b[0]);
    }

    private styleModuleReduce(accumulated: StyleModuleDisplayList, current: [string, Styles]) {
        const [topGroup, ...remaining] = current[0].split(".");
        const topGroupFormatted = nameToTitle(topGroup);
        const modules = accumulated.has(topGroupFormatted) ? accumulated.get(topGroupFormatted) : [];
        modules.push({
            name: current[0],
            title: remaining.map((value) => nameToTitle(value)).join(" / "),
        });
        accumulated.set(topGroupFormatted, modules);
        return accumulated;
    }

    /**
     * Get all registered style modules.
     */
    public getAvailableStyleModules(): StyleModuleDisplayList {
        return new Array(...Styles.Shared.entries())
            .sort(this.styleModuleSort)
            .reduce<StyleModuleDisplayList>(this.styleModuleReduce, new Map());
    }

    /**
     * Gets a display representation of applied style modules for the selected nodes.
     * @returns Applied style modules.
     */
    public getAppliedStyleModules(): StyleModuleDisplayList {
        const allModules: Map<string, Styles> = new Map();

        // TODO: Handle multiple values better
        this._selectedNodes.forEach(node => {
            node.appliedStyleModules.forEach((name) => {
                if (!allModules.has(name)) {
                    allModules.set(name, null); // null Styles for now
                }
            })
        });

        return new Array(...allModules.entries())
            .sort(this.styleModuleSort)
            .reduce<StyleModuleDisplayList>(this.styleModuleReduce, new Map());
    }

    public applyStyleModule(name: string) {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("applying style module to node", name);

            node.appliedStyleModules.push(name);
            this.evaluateEffectiveAppliedStyleValues([node]);
            // console.log("  node", node);
        });

        this.dispatchState("applyStyleModule");
    }

    public removeStyleModule(name: string) {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("removing style module from node", name);

            const foundIndex = node.appliedStyleModules.indexOf(name);
            if (foundIndex > -1) {
                node.appliedStyleModules.splice(foundIndex, 1);
            }
            // console.log("  node", node);
        });

        this.dispatchState("removeStyleModule");
    }

    public supports(target: StyleProperty) {
        return this._selectedNodes.some(node => node.supports.includes(target));
    }

    /**
     * Gets a display representation of design tokens applied to the selected nodes.
     * @returns Applied design tokens.
     */
    private getDesignTokenValues(): UIDesignTokenValue[] {
        const tokenValues = new Map<string, Set<string>>();
        const designTokens: UIDesignTokenValue[] = [];

        this._selectedNodes.forEach(node =>
            node.designTokens.forEach((designToken, designTokenId) => {
                if (designToken.value) {
                    const values = tokenValues.get(designTokenId) || new Set<string>();
                    values.add(designToken.value);
                    tokenValues.set(designTokenId, values);
                }
            })
        );

        const allDesignTokens = this._designTokenRegistry.entries;

        allDesignTokens.forEach(designToken => {
            if (tokenValues.has(designToken.id)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const set = tokenValues.get(designToken.id)!;
                designTokens.push({
                    definition: designToken,
                    value: set.size === 1 ? set.values().next().value : undefined,
                    multipleValues: set.size > 1 ? [...set].join(", ") : undefined,
                });
            }
        });

        return designTokens;
    }

    /**
     * Gets a display representation of applied design tokens for the selected nodes.
     * @param target Style property type.
     * @returns Applied design tokens.
     */
    public appliedDesignTokens(target: StyleProperty): AppliedDesignTokenItem[] {
        const tokens: AppliedDesignTokenItem[] = [];

        // TODO: Handle multiple values better
        this._selectedNodes.forEach(node => {
            const applied = node.appliedDesignTokens.get(target);
            if (applied) {
                tokens.push({
                    target,
                    tokenID: applied.tokenID,
                    value: applied.value
                });
            }
        });

        return tokens;
    }

    /**
     * Gets a list of appliable design tokens for the style property type.
     * @param target Style property type.
     * @returns List of available appliable design tokens.
     */
    public appliableDesignTokenOptionsByType(target: StyleProperty): DesignTokenDefinition[] {
        const val = this._appliableDesignTokenRegistry.find(target);
        return val;
    }

    public getAppliableDesignTokenDefinition(id: string): DesignTokenDefinition | null {
        return this._appliableDesignTokenRegistry.get(id);
    }

    /**
     * Gets the node IDs to which the design tokens is applied.
     * @param id - The design token ID.
     */
    public getNodesWithDesignTokenApplied(id: string): string[] {
        return this._selectedNodes
            .filter(node => {
                return Object.keys(node.appliedDesignTokens).includes(id);
            })
            .map(node => node.id);
    }

    /**
     * Resets all design tokens for the selected nodes.
     */
    public resetNodes(): void {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("reset", node);

            node.designTokens.clear();
            node.appliedDesignTokens.clear();
        });

        this.dispatchState("resetNodes");
    }

    /**
     * Reduces the effective set of applied design tokens or values from the various sources.
     * @param node - The plugin UI node data.
     * @returns The effective set of applied styles by target property.
     */
    private collectEffectiveAppliedStyles(node: PluginUINodeData): Map<StyleProperty, AppliedStyleValueInfo> {
        const allApplied = new Map<StyleProperty, AppliedStyleValueInfo>();

        const registry = this._appliableDesignTokenRegistry;
        function appliedDesignTokensHandler(source: AppliedTokenSource): (applied: AppliedDesignToken, target: StyleProperty) => void {
            return function(applied, target) {
                const token = registry.get(applied.tokenID);
                allApplied.set(target, {
                    value: token.token as CSSDesignToken<any>,
                    source,
                });
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
                    // console.warn("Token not found in appliable tokens", info.token);
                }
            });

            // console.log("      evaluations", node.effectiveAppliedStyleValues);

            if (node.children.length > 0) {
                this.evaluateEffectiveAppliedStyleValues(node.children);
            }
        });
    }

    private evaluateEffectiveAppliedDesignToken(target: StyleProperty, token: CSSDesignToken<any>, node: PluginUINodeData, source: AppliedTokenSource) {
        let value: any = this.getDesignTokenValue(node, token);
        if (typeof (value as any).toColorString === "function") {
            value = (value as any).toColorString();
        } else if (typeof value === "string") {
            if (value.startsWith("calc")) {
                const ret = calc(value as string);
                console.log(`    calc ${value} returns ${ret}`);
                value = ret;
            }
        }
        // console.log("    evaluateEffectiveAppliedDesignToken", target, " : ", token.name, " -> ", value, `(from ${source})`);

        const applied = new AppliedStyleValue((value as unknown) as string);
        node.effectiveAppliedStyleValues.set(target, applied);

        if (source === AppliedTokenSource.local) {
            const appliedToken = new AppliedDesignToken(token.name, (value as unknown) as string);
            node.appliedDesignTokens.set(target, appliedToken);
        }

        // TODO: The fillColor context isn't working yet, so only use it for "fixed" layer backgrounds for now.
        if (target === StyleProperty.backgroundFill && token.name.startsWith("layer-fill-fixed")) {
            // console.log(`      Fill style property, setting '${TOOL_FILL_COLOR_TOKEN}' design token`);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const def = this._designTokenRegistry.get(TOOL_FILL_COLOR_TOKEN)!;
            const element = this.getElementForNode(node);
            node.designTokens.set(TOOL_FILL_COLOR_TOKEN, { value: applied.value });
            this.setDesignTokenForElement(element, def.token, applied.value);

            // TODO: Optimize this, currently it will process children twice.
            if (node.children.length > 0) {
                this.evaluateEffectiveAppliedStyleValues(node.children);
            }
        }
    }

    public removeAppliedDesignToken(target: StyleProperty, tokenID: string): void {
        this._selectedNodes.forEach(node => {
            const applied = node.appliedDesignTokens.get(target);
            if (applied?.tokenID === tokenID) {
                node.appliedDesignTokens.delete(target);
            }

            // console.log("--------------------------------");
            // console.log("removed applied design token from node", target, node);
        });

        this.evaluateEffectiveAppliedStyleValues(this._selectedNodes);

        this.dispatchState("removeAppliedDesignToken");
    }

    public applyDesignToken(target: StyleProperty, token: DesignTokenDefinition): void {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("applying token to node", target, token);

            this.evaluateEffectiveAppliedDesignToken(target, token.token as CSSDesignToken<any>, node, AppliedTokenSource.local);

            // console.log("  node", node);
        });

        this.dispatchState("applyDesignToken");
    }

    private setDesignTokenForElement<T>(nodeElement: FASTElement, token: DesignToken<T>, value: T | null) {
        try {
            if (value) {
                // TODO figure out a better way to handle storage data types
                const color = parseColorHexRGB((value as unknown) as string);
                if (color) {
                    // TODO fix this logic
                    // console.log("    setting DesignToken value (color)", token.name, value);
                    if (token.name.indexOf("base-color") > -1) {
                        // console.log("      raw value");
                        token.setValueFor(
                            nodeElement,
                            value as StaticDesignTokenValue<T>
                        );
                    } else {
                        // console.log("      color object");
                        token.setValueFor(
                            nodeElement,
                            (SwatchRGB.from(color) as unknown) as StaticDesignTokenValue<T>
                        );
                    }
                } else {
                    const num = Number.parseFloat((value as unknown) as string);
                    if (!Number.isNaN(num) && num.toString() === value) {
                        // console.log("    setting DesignToken value (number)", token.name, value);
                        token.setValueFor(
                            nodeElement,
                            (num as unknown) as StaticDesignTokenValue<T>
                        );
                    } else {
                        // console.log("    setting DesignToken value (unconverted)", token.name, value);
                        token.setValueFor(nodeElement, value as StaticDesignTokenValue<T>);
                    }
                }
            } else {
                token.deleteValueFor(nodeElement);
            }
        } catch (e) {
            console.warn("    token error", e);
            // Ignore, token not found
        }
    }

    private getElementForNode(node: PluginUINodeData): FASTElement {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const element = this._rootElement.querySelector(
            `#${CSS.escape(node.id)}`
        )! as FASTElement;
        return element;
    }

    private designTokenValuesHandler(
        nodeElement: FASTElement
    ): (value: DesignTokenValue, key: string) => void {
        return (value: DesignTokenValue, key: string): void => {
            const def = this._designTokenRegistry.get(key);
            // console.log("      setting token", key, def, value.value);
            if (def) {
                this.setDesignTokenForElement(
                    nodeElement,
                    def.token,
                    value.value as string
                );
            }
        };
    }

    private setupDesignTokenElement(element: HTMLElement, node: PluginUINodeData) {
        // console.log("  setupDesignTokenElement - node", node, "parent", element.id);

        // Create an element representing this node in our local dom.
        const nodeElement = document.createElement(
            "plugin-design-system-provider"
        ) as FASTElement;
        nodeElement.id = node.id;
        element.appendChild(nodeElement);

        // Set all the inherited design token values for the local element.
        // console.log("    setting inherited tokens");
        node.inheritedDesignTokens.forEach(
            this.designTokenValuesHandler(nodeElement),
            this
        );

        // Set all design token values from the main component for the local element (an instance component).
        // console.log("    setting main component tokens", node.componentDesignTokens);
        node.componentDesignTokens?.forEach(
            this.designTokenValuesHandler(nodeElement),
            this
        );

        // Set all the design token override values for the local element.
        // console.log("    setting local tokens");
        node.designTokens.forEach(this.designTokenValuesHandler(nodeElement), this);

        // Handle any additional data. Keys are provided as design token ids.
        node.additionalData.forEach((value, key) => {
            const def = this._designTokenRegistry.get(key);
            if (def) {
                // console.log("      setting token value on element", def, "value", value);
                this.setDesignTokenForElement(nodeElement, def.token, value);
            }
        }, this);

        node.children.forEach(child => this.setupDesignTokenElement(nodeElement, child));
    }

    private valueToString(value: any): string {
        // TODO figure out a better way to handle storage data types
        if (typeof value.toColorString === "function") {
            return value.toColorString();
        } else {
            return "" + value;
        }
    }

    private getDesignTokenDefinitions(): DesignTokenDefinition[] {
        return this._designTokenRegistry.entries;
    }

    public getDesignTokenDefinition(id: string): DesignTokenDefinition | null {
        return this._designTokenRegistry.get(id);
    }

    public getDefaultDesignTokenValue<
        T
    >(token: DesignToken<T>): string {
        const val = this.valueToString(token.getValueFor(this._rootElement));
        // console.log("getDefaultDesignTokenValue", "token", token, "value", val);
        return val;
    }

    public getDesignTokenValue(node: PluginUINodeData, token: DesignToken<any>): any {
        // Evaluate the token based on the tokens provided to the element.
        const element = this.getElementForNode(node);
        const val = token.getValueFor(element);
        // console.log("      getDesignTokenValue", node.id, node.type, token.name, "value", this.valueToString(val));
        return val;
    }

    private setDesignTokenForNode<T>(
        node: PluginUINodeData,
        definition: DesignTokenDefinition,
        value: T | null
    ): void {
        if (value) {
            const valueAsString = this.valueToString(value);
            const designToken = new DesignTokenValue(valueAsString);
            node.designTokens.set(definition.id, designToken);
        } else {
            node.designTokens.delete(definition.id);
        }
        // console.log("  after set designTokens", node.id, node.type, node.designTokens);

        const element = this.getElementForNode(node);
        this.setDesignTokenForElement(element, definition.token, value);
    }

    private setupDesignTokenObservables() {
        this.designTokenValues = this.getDesignTokenValues();

        // Get all design tokens that can be added, which is the full list except any already applied.
        this.availableDesignTokens = this.getDesignTokenDefinitions().filter((definition) =>
            this.designTokenValues.find((appliedToken) => appliedToken.definition.id === definition.id) === undefined
        );
    }

    public setDesignToken(definition: DesignTokenDefinition, value: any): void {
        const nodes = this._selectedNodes;

        // console.log("--------------------------------");
        // console.log("UIController.setDesignToken", definition, value, typeof value, nodes);

        nodes.forEach(node => this.setDesignTokenForNode(node, definition, value));

        // console.log("  Evaluating all design tokens for all selected nodes");
        this.evaluateEffectiveAppliedStyleValues(this._selectedNodes);

        this.setupDesignTokenObservables();

        this.dispatchState("setDesignToken " + definition.id);
    }

    public removeDesignToken(definition: DesignTokenDefinition): void {
        const nodes = this._selectedNodes;

        // console.log("--------------------------------");
        // console.log("UIController.removeDesignToken", definition.id, nodes);

        nodes.forEach(node => this.setDesignTokenForNode(node, definition, null));

        // console.log("  Evaluating all design tokens for all selected nodes");
        this.evaluateEffectiveAppliedStyleValues(this._selectedNodes);

        this.setupDesignTokenObservables();

        this.dispatchState("removeDesignToken");
    }

    private dispatchState(reason: string): void {
        // console.log("UIController.dispatchState", reason);
        this._updateStateCallback(this._selectedNodes);
    }
}
