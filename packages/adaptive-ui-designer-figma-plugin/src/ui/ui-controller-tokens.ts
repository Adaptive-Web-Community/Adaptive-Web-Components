import { calc } from '@csstools/css-calc';
import { observable } from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import { Color } from "@adaptive-web/adaptive-ui";
import { DesignTokenValue, PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";
import { UIController } from "./ui-controller.js";
import { ElementsController } from "./ui-controller-elements.js";

/**
 * Simple display information for representing design tokens applied to one or more nodes.
 */
export interface UIDesignTokenValue {
    /**
     * The design token.
     */
    token: DesignToken<any>;

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
 * A sub-controller responsible for managing design tokens.
 */
export class DesignTokenController {
    /**
     * A display representation of design tokens applied to the selected nodes.
     */
    @observable
    public designTokenValues: UIDesignTokenValue[] | null = null;

    /**
     * A list of all design tokens which are not already applied to the selected nodes.
     */
    @observable
    public availableDesignTokens: DesignToken<any>[] | null = null;

    constructor(
        private readonly controller: UIController,
        private readonly elements: ElementsController,
    ) {
    }

    /**
     * Allow this controller to do any necessary setup when the selected nodes change.
     */
    public selectedNodesChanged() {
        // console.log("--------------------------------");
        // console.log("DesignTokenController.selectedNodesChanged", nodes);

        this.setupDesignTokenObservables();
    }

    /**
     * Sets up the observables for all and available (unused) design tokens. 
     */
    private setupDesignTokenObservables() {
        this.designTokenValues = this.getDesignTokenValues();

        // Get all design tokens that can be added, which is the full list except any already applied.
        this.availableDesignTokens = this.controller.designTokenRegistry.entries.filter((token) =>
            this.designTokenValues?.find((appliedToken) => appliedToken.token.name === token.name) === undefined
        );
    }

    /**
     * Gets a display representation of design tokens applied to the selected nodes.
     *
     * @returns Applied design tokens.
     */
    private getDesignTokenValues(): UIDesignTokenValue[] {
        const tokenValuesMap = this.controller.selectedNodes
            .flatMap(node =>
                Array.from(node.designTokens.entries()).map(([designTokenId, designToken]) => ({
                    designTokenId,
                    value: designToken.value
                }))
            )
            .filter(item => item.value)
            .reduce((acc, item) => {
                const values = acc.get(item.designTokenId) || new Set<string>();
                values.add(item.value);
                acc.set(item.designTokenId, values);
                return acc;
            }, new Map<string, Set<string>>());

        const allDesignTokens = this.controller.designTokenRegistry.entries;

        // This must include all design tokens, not only the ones in the registry.
        return Array.from(tokenValuesMap.entries()).map(([tokenName, valueSet]) => {
            const token = allDesignTokens.find(t => t.name === tokenName);
            return {
                token: token || { name: tokenName } as DesignToken<any>,
                value: valueSet.size === 1 ? valueSet.values().next().value : undefined,
                multipleValues: valueSet.size > 1 ? [...valueSet].join(", ") : undefined,
            };
        });
    }

    private valueToString(value: any): string {
        // TODO figure out a better way to handle storage data types
        // Reconcile with similar block in evaluateEffectiveAppliedDesignToken
        if (value instanceof Color) {
            return value.toString();
        } else if (typeof value === "string") {
            if (value.startsWith("calc")) {
                return calc(value);
            } else {
                return value;
            }
        } else {
            return "" + value;
        }
    }

    /**
     * Gets the default token value as a string for display.
     *
     * @param token - The design token
     * @returns The default token value as a string for display
     */
    public getDefaultDesignTokenValueAsString(token: DesignToken<any>): string {
        const val = this.valueToString(token.getValueFor(this.elements.rootElement));
        // console.log("getDefaultDesignTokenValueAsString", "token", token, "value", val);
        return val;
    }

    private setDesignTokenForNode(node: PluginUINodeData, token: DesignToken<any>, value: any): void {
        if (value) {
            const designToken = new DesignTokenValue(value);
            node.designTokens.set(token.name, designToken);
        } else {
            node.designTokens.delete(token.name);
        }
        // console.log("  after set designTokens", node.id, node.type, node.designTokens);

        const element = this.elements.getElementForNode(node);
        this.elements.setDesignTokenForElement(element, token, value);
    }

    /**
     * Sets a design token value (override) for the selected nodes.
     *
     * @param token - The design token definition
     * @param value - The value for this design token for the selected nodes
     */
    public setDesignToken(token: DesignToken<any>, value: any): void {
        const nodes = this.controller.selectedNodes;

        // console.log("--------------------------------");
        // console.log("DesignTokenController.setDesignToken", token, value, typeof value, nodes);

        nodes.forEach(node =>
            this.setDesignTokenForNode(node, token, value)
        );

        this.setupDesignTokenObservables();

        this.controller.refreshSelectedNodes("setDesignToken " + token.name);
    }

    /**
     * Removes a design token value (override) from the selected nodes.
     *
     * @param token - The design token definition
     */
    public removeDesignToken(token: DesignToken<any>): void {
        const nodes = this.controller.selectedNodes;

        // console.log("--------------------------------");
        // console.log("DesignTokenController.removeDesignToken", token.name, nodes);

        nodes.forEach(node =>
            this.setDesignTokenForNode(node, token, null)
        );

        this.setupDesignTokenObservables();

        this.controller.refreshSelectedNodes("removeDesignToken " + token.name);
    }
}
