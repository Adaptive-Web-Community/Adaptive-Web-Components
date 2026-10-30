import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { SelectParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Select } from "./select.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the select.
 *
 * @public
 */
export const SelectStatics = {
    indicator: "select-indicator"
} as const;

/**
 * @public
 */
export type SelectStatics = ValuesOf<typeof SelectStatics>;

/**
 * @public
 */
export const SelectConditions = {
    open: ":state(open)",
    readOnly: "[readonly]",
};

export { SelectParts };

/**
 * @public
 */
export const SelectAnatomy: ComponentAnatomy<typeof SelectConditions, typeof SelectParts> = {
    interactivity: controlInteractivity,
    conditions: SelectConditions,
    parts: SelectParts,
    focus: Focus.partFocused("control"),
};

/**
 * Default Select template: the combobox, which shows the selected option, and the popup of the options next to it. The element's controller
 * writes the combobox's state.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Select> =
    (ds: DesignSystem) => html<Select>`
        <span class="label" part="label" ?hidden="${x => !x.label && !x.labelElements.length}" ${ref("labelPart")}>
            <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div
            class="control"
            part="control"
            role="combobox"
            tabindex="0"
            aria-haspopup="listbox"
            aria-controls="listbox"
            ${ref("control")}
        >
            <slot name="start"></slot>
            <span class="selected-value" part="selected-value">${x => x.selectedText}</span>
            <span class="indicator" part="indicator" aria-hidden="true">
                <slot name="indicator">${staticallyCompose(ds.statics.get(SelectStatics.indicator))}</slot>
            </span>
            <slot name="end"></slot>
        </div>
        <div id="listbox" class="listbox" part="listbox" role="listbox" popover="auto" ${ref("listbox")}>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
    `;
