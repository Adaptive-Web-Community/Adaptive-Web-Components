import { calc } from '@csstools/css-calc';
import { observable } from "@microsoft/fast-element";
import { type DesignToken } from "@microsoft/fast-foundation";
import { Color } from "@adaptive-web/adaptive-ui";
import { formatHex8 } from 'culori';
import { DesignTokenDefinition, DesignTokenValue, PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";
import { UIController } from "./ui-controller.js";
import { ElementsController } from "./ui-controller-elements.js";

/**
 * Simple display information for representing design tokens applied to one or more nodes.
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
    public availableDesignTokens: DesignTokenDefinition[] | null = null;

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
        this.availableDesignTokens = this.controller.designTokenRegistry.entries.filter((definition) =>
            this.designTokenValues?.find((appliedToken) => appliedToken.definition.id === definition.id) === undefined
        );
    }

    /**
     * Gets a display representation of design tokens applied to the selected nodes.
     *
     * @returns Applied design tokens.
     */
    private getDesignTokenValues(): UIDesignTokenValue[] {
        const tokenValues = new Map<string, Set<string>>();
        const designTokens: UIDesignTokenValue[] = [];

        this.controller.selectedNodes.forEach(node =>
            node.designTokens.forEach((designToken, designTokenId) => {
                if (designToken.value) {
                    const values = tokenValues.get(designTokenId) || new Set<string>();
                    values.add(designToken.value);
                    tokenValues.set(designTokenId, values);
                }
            })
        );

        const allDesignTokens = this.controller.designTokenRegistry.entries;

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

    private valueToString(value: any): string {
        // TODO figure out a better way to handle storage data types
        // Reconcile with similar block in evaluateEffectiveAppliedDesignToken
        if (value instanceof Color) {
            return formatHex8(value.color);
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

    private setDesignTokenForNode(node: PluginUINodeData, definition: DesignTokenDefinition, value: any): void {
        if (value) {
            const designToken = new DesignTokenValue(value);
            node.designTokens.set(definition.id, designToken);
        } else {
            node.designTokens.delete(definition.id);
        }
        // console.log("  after set designTokens", node.id, node.type, node.designTokens);

        const element = this.elements.getElementForNode(node);
        this.elements.setDesignTokenForElement(element, definition.token, value);
    }

    /**
     * Sets a design token value (override) for the selected nodes.
     *
     * @param definition - The design token definition
     * @param value - The value for this design token for the selected nodes
     */
    public setDesignToken(definition: DesignTokenDefinition, value: any): void {
        const nodes = this.controller.selectedNodes;

        // console.log("--------------------------------");
        // console.log("DesignTokenController.setDesignToken", definition, value, typeof value, nodes);

        nodes.forEach(node =>
            this.setDesignTokenForNode(node, definition, value)
        );

        this.setupDesignTokenObservables();

        this.controller.refreshSelectedNodes("setDesignToken " + definition.id);
    }

    /**
     * Removes a design token value (override) from the selected nodes.
     *
     * @param definition - The design token definition
     */
    public removeDesignToken(definition: DesignTokenDefinition): void {
        const nodes = this.controller.selectedNodes;

        // console.log("--------------------------------");
        // console.log("DesignTokenController.removeDesignToken", definition.id, nodes);

        nodes.forEach(node =>
            this.setDesignTokenForNode(node, definition, null)
        );

        this.setupDesignTokenObservables();

        this.controller.refreshSelectedNodes("removeDesignToken " + definition.id);
    }
}
