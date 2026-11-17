import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import {
    radioDocumentation,
    RadioParts,
    RadioSlots,
    radioWebBinding,
    type ValuesOf,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Radio } from "./radio.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the radio.
 *
 * @public
 */
export const RadioStatics = {
    checked: "radio-checked-indicator"
} as const;

/**
 * @public
 */
export type RadioStatics = ValuesOf<typeof RadioStatics>;

/**
 * @public
 */
export const RadioAnatomy = documentationToComponentAnatomy(radioDocumentation, radioWebBinding);

/**
 * Default Radio template. The element is the radio, and its label names it.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Radio> =
    (ds: DesignSystem) => html<Radio>`
        <div class=${(_) => RadioParts.control} part=${(_) => RadioParts.control}>
            <slot name=${(_) => RadioSlots.checkedIndicator} ?hidden="${x => !x.checked}">
                ${staticallyCompose(ds.statics.get(RadioStatics.checked))}
            </slot>
        </div>
        <span class=${(_) => RadioParts.label} part=${(_) => RadioParts.label} ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => RadioSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
    `;
