import { html, type TemplateResult } from "lit";
import { buttonDocumentation, ButtonParts, ButtonSlots, buttonWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import type { DesignSystem } from "../../design-system.js";
import type { Button } from "./button.js";

/**
 * @public
 */
export const ButtonAnatomy = documentationToComponentAnatomy(buttonDocumentation, buttonWebBinding);

/**
 * Default Button template. The element is the button, so the template is its content.
 * @public
 */
export const template: (ds: DesignSystem) => (x: Button) => TemplateResult =
    (ds: DesignSystem) => (x: Button) => html`
        <slot name=${ButtonSlots.start}></slot>
        <span class=${ButtonParts.content} part=${ButtonParts.content}>
            <slot></slot>
        </span>
        <slot name=${ButtonSlots.end}></slot>
    `;