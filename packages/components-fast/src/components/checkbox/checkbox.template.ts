import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { CheckboxParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
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
export const CheckboxConditions = {
    checked: ":state(checked)",
    indeterminate: ":state(indeterminate)",
};

export { CheckboxParts };

/**
 * @public
 */
export const CheckboxAnatomy: ComponentAnatomy<typeof CheckboxConditions, typeof CheckboxParts> = {
    interactivity: controlInteractivity,
    conditions: CheckboxConditions,
    parts: CheckboxParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Checkbox template. The element is the checkbox, and its label names it.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Checkbox> =
    (ds: DesignSystem) => html<Checkbox>`
        <div class="control" part="control">
            <slot name="checked-indicator" ?hidden="${x => !x.checked || x.indeterminate}">
                ${staticallyCompose(ds.statics.get(CheckboxStatics.checked))}
            </slot>
            <slot name="indeterminate-indicator" ?hidden="${x => !x.indeterminate}">
                ${staticallyCompose(ds.statics.get(CheckboxStatics.indeterminate))}
            </slot>
        </div>
        <span class="label" part="label" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
    `;
