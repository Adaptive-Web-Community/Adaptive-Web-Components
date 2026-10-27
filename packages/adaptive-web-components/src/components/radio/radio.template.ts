import { type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { hasContent, RadioParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Radio } from "./radio.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the radio.
 *
 * @beta
 */
export const RadioStatics = {
    checked: "radio-checked-indicator"
} as const;

/**
 * @beta
 */
export type RadioStatics = ValuesOf<typeof RadioStatics>;

/**
 * @public
 */
export const RadioConditions = {
    checked: ":state(checked)",
};

export { RadioParts };

/**
 * @public
 */
export const RadioAnatomy: ComponentAnatomy<typeof RadioConditions, typeof RadioParts> = {
    interactivity: controlInteractivity,
    conditions: RadioConditions,
    parts: RadioParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Radio template. The element is the radio, and its content is the label.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Radio> =
    (ds: DesignSystem) => html<Radio>`
        <div class="control" part="control">
            <slot name="checked-indicator" ?hidden="${x => !x.checked}">
                ${staticallyCompose(ds.statics.get(RadioStatics.checked))}
            </slot>
        </div>
        <span class="label" part="label" ?hidden="${x => !hasContent(x.defaultSlottedNodes)}">
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </span>
    `;
