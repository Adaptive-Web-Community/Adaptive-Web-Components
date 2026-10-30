import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { PickerParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Picker } from "./picker.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the picker.
 *
 * @beta
 */
export const PickerStatics = {
    indicator: "picker-indicator",
    removeValue: "picker-remove-value",
} as const;

/**
 * @beta
 */
export type PickerStatics = ValuesOf<typeof PickerStatics>;

/**
 * @public
 */
export const PickerConditions = {
    open: ":state(open)",
    multiple: "[multiple]",
    loading: "[loading]",
    readOnly: "[readonly]",
};

export { PickerParts };

/**
 * @public
 */
export const PickerAnatomy: ComponentAnatomy<typeof PickerConditions, typeof PickerParts> = {
    interactivity: controlInteractivity,
    conditions: PickerConditions,
    parts: PickerParts,
    focus: Focus.partWithin("root", "control"),
};

/**
 * Default Picker template: the label, a native label of the input; the field, with the values, which the element's controller renders, and the native input, whose state the
 * controller writes, and the popup next to it, with the options and the status. The content of the values' remove buttons is copied from
 * a hidden element.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Picker> =
    (ds: DesignSystem) => html<Picker>`
        <label class="label" part="label" for="control" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </label>
        <div class="root" part="root" ${ref("root")}>
            <slot name="start"></slot>
            <div class="values" part="values" role="list" hidden ${ref("valueList")}></div>
            <input
                id="control"
                class="control"
                part="control"
                role="combobox"
                autocomplete="off"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-controls="listbox"
                ${ref("control")}
            />
            <span class="indicator" part="indicator" aria-hidden="true">
                <slot name="indicator">${staticallyCompose(ds.statics.get(PickerStatics.indicator))}</slot>
            </span>
            <slot name="end"></slot>
        </div>
        <span hidden ${ref("removeContent")}>${staticallyCompose(ds.statics.get(PickerStatics.removeValue))}</span>
        <div class="popup" part="popup" popover="auto" ${ref("popup")}>
            <div id="listbox" class="listbox" part="listbox" role="listbox" ${ref("listbox")}>
                <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            </div>
            <div class="status" part="status" role="status">
                <span hidden ${ref("noResults")}><slot name="no-results">No results</slot></span>
                <span hidden ${ref("loadingStatus")}><slot name="loading">Loading</slot></span>
            </div>
        </div>
    `;
