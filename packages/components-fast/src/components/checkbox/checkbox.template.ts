import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import {
    checkboxDocumentation,
    CheckboxParts,
    CheckboxSlots,
    checkboxWebBinding,
    type ValuesOf,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Checkbox } from "./checkbox.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the checkbox.
 *
 * @public
 */
export const CheckboxStatics = {
    checked: "checkbox-checked-indicator",
    indeterminate: "checkbox-indeterminate-indicator"
} as const;

/**
 * @public
 */
export type CheckboxStatics = ValuesOf<typeof CheckboxStatics>;

/**
 * @public
 */
export const CheckboxAnatomy = documentationToComponentAnatomy(checkboxDocumentation, checkboxWebBinding);

/**
 * Default Checkbox template. The element is the checkbox, and its label names it.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Checkbox> =
    (ds: DesignSystem) => html<Checkbox>`
        <div class=${(_) => CheckboxParts.control} part=${(_) => CheckboxParts.control}>
            <slot name=${(_) => CheckboxSlots.checkedIndicator} ?hidden="${x => !x.checked || x.indeterminate}">
                ${staticallyCompose(ds.statics.get(CheckboxStatics.checked))}
            </slot>
            <slot name=${(_) => CheckboxSlots.indeterminateIndicator} ?hidden="${x => !x.indeterminate}">
                ${staticallyCompose(ds.statics.get(CheckboxStatics.indeterminate))}
            </slot>
        </div>
        <span class=${(_) => CheckboxParts.label} part=${(_) => CheckboxParts.label} ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => CheckboxSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
    `;
