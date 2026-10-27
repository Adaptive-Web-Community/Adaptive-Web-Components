import { type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ButtonParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import type { Button } from "./button.js";

/**
 * @public
 */
export const ButtonConditions = {
    iconOnly: ":state(icon-only)",
};

export { ButtonParts };

/**
 * @public
 */
export const ButtonAnatomy: ComponentAnatomy<typeof ButtonConditions, typeof ButtonParts> = {
    interactivity: controlInteractivity,
    conditions: ButtonConditions,
    parts: ButtonParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Button template. The element is the button, so the template is its content.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Button> =
    (ds: DesignSystem) => html<Button>`
        <slot name="start"></slot>
        <span class="content" part="content">
            <slot ${slotted("defaultSlottedContent")}></slot>
        </span>
        <slot name="end"></slot>
    `;
