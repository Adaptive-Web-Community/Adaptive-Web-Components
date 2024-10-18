import { customElement, FASTElement, html } from "@microsoft/fast-element";
import type { DesignToken, StaticDesignTokenValue } from "@microsoft/fast-foundation";
import { Swatch } from "@adaptive-web/adaptive-ui";
import { fillColor } from "@adaptive-web/adaptive-ui/reference";
import { DesignTokenValue, PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";
import { UIController } from "./ui-controller.js";

const providerElementName = "plugin-design-system-provider";

@customElement({
    name: providerElementName,
    template: html`
        <slot></slot>
    `,
})
class DesignSystemProvider extends FASTElement {}

export class ElementsController {
    /**
     * The container for the elements created for each node so we can resolve values from the Design Token infrastructure.
     * We don't need to set values for every design token because for we'll get the token's withDefault value.
     */
    public readonly rootElement: DesignSystemProvider;

    constructor(
        private readonly controller: UIController,
    ) {
        this.rootElement = document.createElement(providerElementName) as DesignSystemProvider;
        this.rootElement.id = "designTokenRoot";
        document.body.appendChild(this.rootElement as unknown as Node);
    }

    /**
     * Allow this controller to do any necessary setup when the selected nodes change.
     */
    public selectedNodesChanged() {
        // Setup shadow elements
        this.rootElement.childNodes.forEach(child =>
            this.rootElement.removeChild(child)
        );

        this.resetFillColor();

        this.controller.selectedNodes.forEach(node => this.setupDesignTokenElement(this.rootElement, node));
    }

    /**
     * Sets a design token value for a node element.
     *
     * @param nodeElement - The element representing the node
     * @param token - The design token
     * @param value - The design token value
     */
    public setDesignTokenForElement<T>(nodeElement: FASTElement, token: DesignToken<T>, value: T | null) {
        try {
            if (value) {
                // TODO figure out a better way to handle storage data types
                const color = Swatch.parse((value as unknown) as string);
                if (color) {
                    // TODO fix this logic
                    // console.log("        setting DesignToken value (color)", token.name, value);
                    if (token.name.indexOf("base-color") > -1) {
                        // console.log("          raw value");
                        token.setValueFor(
                            nodeElement,
                            value as StaticDesignTokenValue<T>
                        );
                    } else {
                        // console.log("          color object");
                        token.setValueFor(
                            nodeElement,
                            (color as unknown) as StaticDesignTokenValue<T>
                        );
                    }
                } else {
                    const num = Number.parseFloat((value as unknown) as string);
                    if (!Number.isNaN(num) && num.toString() === value) {
                        // console.log("        setting DesignToken value (number)", token.name, value);
                        token.setValueFor(
                            nodeElement,
                            (num as unknown) as StaticDesignTokenValue<T>
                        );
                    } else {
                        // console.log("        setting DesignToken value (unconverted)", token.name, value);
                        token.setValueFor(nodeElement, value as StaticDesignTokenValue<T>);
                    }
                }
            } else {
                token.deleteValueFor(nodeElement);
            }
        } catch (e) {
            console.warn("        token error", e);
            // Ignore, token not found
        }
    }

    /**
     * Gets an element representing a node.
     *
     * @param node - The node
     * @returns The element
     */
    public getElementForNode(node: PluginUINodeData): FASTElement {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const element = this.rootElement.querySelector(
            `#${CSS.escape(node.id)}`
        )! as unknown as FASTElement;
        return element;
    }

    /**
     * Gets the value for the requested design token and node.
     *
     * @param node - The node
     * @param token - The design tokens
     * @returns The value for the requested design token and node
     */
    public getDesignTokenValue(node: PluginUINodeData, token: DesignToken<any>): any {
        // Evaluate the token based on the tokens provided to the element.
        const element = this.getElementForNode(node);
        const val = token.getValueFor(element);
        // console.log("      getDesignTokenValue", node.id, node.type, token.name, "value", this.valueToString(val));
        // console.log("        fill color", fillColor.getValueFor(element)?.toColorString(), element);
        return val;
    }

    private designTokenValuesHandler(
        element: FASTElement
    ): (value: DesignTokenValue, key: string) => void {
        return (value: DesignTokenValue, key: string): void => {
            const def = this.controller.designTokenRegistry.get(key);
            // console.log("      setting token", key, def, value.value);
            if (def) {
                this.setDesignTokenForElement(
                    element,
                    def.token,
                    value.value
                );
            }
        };
    }

    private setupDesignTokenElement(element: HTMLElement, node: PluginUINodeData) {
        // console.log("  setupDesignTokenElement - node", node, "parent", element.id);

        // Create an element representing this node in our local dom.
        const nodeElement = document.createElement(providerElementName) as FASTElement;
        nodeElement.id = node.id;
        nodeElement.title = node.name;
        element.appendChild(nodeElement as unknown as Node);

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

        // Handle any additional data. Any keys that are for a design token will be set.
        // console.log("    setting additional data");
        node.additionalData.forEach((value, key) => {
            const def = this.controller.designTokenRegistry.get(key);
            if (def) {
                // console.log("      setting token value on element", def, "value", value);
                this.setDesignTokenForElement(nodeElement, def.token, value);
            }
        }, this);

        node.children.forEach(child => this.setupDesignTokenElement(nodeElement, child));
    }

    /**
     * Resets the `fill-color` token value on the full element tree.
     */
    public resetFillColor() {
        this.resetFillColorForElement(this.rootElement);
    }

    private resetFillColorForElement(element: FASTElement) {
        this.setDesignTokenForElement(element, fillColor, null);
        element.childNodes.forEach(child =>
            this.resetFillColorForElement(child as unknown as FASTElement)
        );
    }
}
