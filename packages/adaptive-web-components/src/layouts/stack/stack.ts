import { attr, booleanConverter, FASTElement } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";

export type StackAlignment = "start" | "center" | "end" | "stretch";

/**
 * The Adaptive Stack layout.
 */
export class Stack extends FASTElement {
    /**
     * Enables wrapping of slotted elements
     * 
     * @default false
     */
    @attr({ mode: "boolean", converter: booleanConverter })
    public wrap: boolean = false;

    /**
     * The orientation of the Stack
     * 
     * @remarks
     * Abstraction for FlexBox flex-direction
     * 
     * @default
     * {@link @microsoft/fast-web-utilities#Orientation.horizontal}
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;

    /**
     * Sets the value of the local --spacing CSS custom property.
     * 
     * @remarks
     * Used to apply spacing overrides to the Stack outside of the Design System's
     * density settings.
     * 
     * @default
     * {@link @adaptive-web/adaptive-ui#designUnit}
     */
    @attr
    public spacing: string;
    protected spacingChanged(previous: string, next: string): void {
        this.style.setProperty("--spacing", next);
    }

    /**
     * Abstraction for alignment along the vertical axis in FlexBox layouts.
     * 
     * @remarks Consistent alignment along the vertical axis independent of the orientation.
     * 
     * @default "start"
     */
    @attr({ attribute: "vertical-align" })
    public verticalAlign: StackAlignment = "start";

    /**
     * Abstraction for alignment along the horizontal axis in FlexBox layouts.
     * 
     * @remarks Consistent alignment along the horizontal axis independent of the orientation.
     * 
     * @default "start"
     */
    @attr({ attribute: "horizontal-align" })
    public horizontalAlign: StackAlignment = "start";
}