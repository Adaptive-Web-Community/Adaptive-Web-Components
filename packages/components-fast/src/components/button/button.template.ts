import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { buttonDocumentation, ButtonParts, ButtonSlots, buttonWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Button } from "./button.js";

/**
 * @public
 */
export const ButtonAnatomy = documentationToComponentAnatomy(buttonDocumentation, buttonWebBinding);

/**
 * Default Button template. The element is the button, so the template is its content.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Button> =
    (ds: DesignSystem) => html<Button>`
        <slot name=${(_) => ButtonSlots.start}></slot>
        <span class=${(_) => ButtonParts.content} part=${(_) => ButtonParts.content}>
            <slot></slot>
        </span>
        <slot name=${(_) => ButtonSlots.end}></slot>
    `;
