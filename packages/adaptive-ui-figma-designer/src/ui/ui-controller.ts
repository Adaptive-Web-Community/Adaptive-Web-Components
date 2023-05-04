import { StyleProperty, SwatchRGB } from "@adaptive-web/adaptive-ui";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { customElement, FASTElement, html } from "@microsoft/fast-element";
import type { DesignToken, StaticDesignTokenValue } from "@microsoft/fast-foundation";
import { AppliedDesignToken, DesignTokenValue, PluginUINodeData } from "../core/model.js";
import { DesignTokenDefinition, DesignTokenRegistry } from "../core/registry/design-token-registry.js";
import { registerAppliableTokens, registerTokens } from "../core/registry/recipes.js";

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
    value?: string;

    /**
     * If the selected nodes have multiple different values this will be a list for display.
     */
    multipleValues?: string;
}

@customElement({
    name: `plugin-design-system-provider`,
    template: html`
        <slot></slot>
    `,
})
class DesignSystemProvider extends FASTElement {}

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
    }

    public refreshSelectedNodes(reason: string = "refreshSelectedNodes"): void {
        this.evaluateAppliedDesignTokens(this._selectedNodes);

        this.dispatchState(reason);
    }

    public supports(target: StyleProperty) {
        return this._selectedNodes.some(node => node.supports.includes(target));
    }

    /**
     * Gets a display representation of design tokens applied to the selected nodes.
     * @returns Applied design tokens.
     */
    public getDesignTokenValues(): UIDesignTokenValue[] {
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
    public appliedDesignTokens(target: StyleProperty): DesignTokenDefinition[] {
        const ids = new Set<string>();
        const tokens: DesignTokenDefinition[] = [];

        this._selectedNodes.forEach(node =>
            node.appliedDesignTokens.forEach((applied) => ids.add(applied.tokenID))
        );

        const targetTokens = this._appliableDesignTokenRegistry.find(target);

        targetTokens.forEach(token => {
            if (ids.has(token.id)) {
                tokens.push(token);
            }
        });

        return tokens.filter(token => token.target === target);
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

    private evaluateAppliedDesignTokens(nodes: PluginUINodeData[]) {
        // console.log("  evaluateAppliedDesignTokens", nodes);
        nodes.forEach(node => {
            const allTokenIds = [
                ...(node.componentAppliedDesignTokens
                    ? node.componentAppliedDesignTokens.values()
                    : new Array<AppliedDesignToken>()),
                ...node.appliedDesignTokens.values(),
            ].map(token => token.tokenID);

            allTokenIds.reduceRight<Array<DesignTokenDefinition>>(
                (previousTokens, currentId, index, array) => {
                    // console.log(previousTokens, currentId, index, array);
                    const currentToken = this._appliableDesignTokenRegistry.get(currentId);
                    if (
                        currentToken &&
                        !previousTokens.find(value => value.target === currentToken.target)
                    ) {
                        // console.log("adding", currentToken);
                        this.evaluateAppliedDesignToken(currentToken, node);
                        previousTokens.push(currentToken);
                    }
                    return previousTokens;
                },
                []
            );

            this.evaluateAppliedDesignTokens(node.children);
        });
    }

    private evaluateAppliedDesignToken(token: DesignTokenDefinition, node: PluginUINodeData): any {
        // console.log("    evaluateAppliedDesignToken", token);
        let value: any = this.getDesignTokenValue(node, token.token);
        if (typeof (value as any).toColorString === "function") {
            value = (value as any).toColorString();
        }
        node.appliedDesignTokens.set(token.target,
            new AppliedDesignToken(token.id, (value as unknown) as string),
        );
        // console.log("      evaluations", node.appliedDesignTokens);

        if (token.target === StyleProperty.backgroundFill) {
            // console.log("      Fill style property, setting fillColor design token");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const def = this._designTokenRegistry.get("fillColor")!;
            const element = this.getElementForNode(node);
            this.setDesignTokenForElement(element, def.token, value);

            this.evaluateAppliedDesignTokens(node.children);
        }

        return value;
    }

    public removeAppliedDesignToken(token: DesignTokenDefinition): void {
        this._selectedNodes.forEach(node => {

            node.appliedDesignTokens.delete(token.target);

            // console.log("--------------------------------");
            // console.log("removed applied design token from node", token.id, node);
        });

        this.evaluateAppliedDesignTokens(this._selectedNodes);

        this.dispatchState("removeAppliedDesignToken");
    }

    public applyDesignToken(token: DesignTokenDefinition): void {
        this._selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("applying token to node", token);

            this.evaluateAppliedDesignToken(token, node);
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
                    if (!Number.isNaN(num)) {
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

    public getDesignTokenDefinitions(): DesignTokenDefinition[] {
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

    public setDesignToken(definition: DesignTokenDefinition, value: any): void {
        const nodes = this._selectedNodes;

        // console.log("--------------------------------");
        // console.log("UIController.setDesignToken", definition, value, typeof value, nodes);

        nodes.forEach(node => this.setDesignTokenForNode(node, definition, value));

        // console.log("  Evaluating all design tokens for all selected nodes");
        this.evaluateAppliedDesignTokens(this._selectedNodes);

        this.dispatchState("setDesignToken " + definition.id);
    }

    public removeDesignToken(definition: DesignTokenDefinition): void {
        const nodes = this._selectedNodes;

        // console.log("--------------------------------");
        // console.log("UIController.removeDesignToken", definition.id, nodes);

        nodes.forEach(node => this.setDesignTokenForNode(node, definition, null));

        // console.log("  Evaluating all design tokens for all selected nodes");
        this.evaluateAppliedDesignTokens(this._selectedNodes);

        this.dispatchState("removeDesignToken");
    }

    private dispatchState(reason: string): void {
        // console.log("UIController.dispatchState", reason);
        this._updateStateCallback(this._selectedNodes);
    }
}
