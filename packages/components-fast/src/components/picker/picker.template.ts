import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import {
    pickerDocumentation,
    PickerParts,
    PickerSlots,
    pickerWebBinding,
    type ValuesOf,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Picker } from "./picker.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the picker.
 *
 * @public
 */
export const PickerStatics = {
    indicator: "picker-indicator",
    removeValue: "picker-remove-value",
} as const;

/**
 * @public
 */
export type PickerStatics = ValuesOf<typeof PickerStatics>;

/**
 * @public
 */
export const PickerAnatomy = documentationToComponentAnatomy(pickerDocumentation, pickerWebBinding);

/**
 * Default Picker template: the label, a native label of the input; the field, with the values, which the element's controller renders, and the native input, whose state the
 * controller writes, and the popup next to it, with the options and the status. The content of the values' remove buttons is copied from
 * a hidden element.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Picker> =
    (ds: DesignSystem) => html<Picker>`
        <label class=${(_) => PickerParts.label} part=${(_) => PickerParts.label} for="control" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => PickerSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </label>
        <div class=${(_) => PickerParts.root} part=${(_) => PickerParts.root} ${ref("root")}>
            <slot name=${(_) => PickerSlots.start}></slot>
            <div class=${(_) => PickerParts.values} part=${(_) => PickerParts.values} role="list" hidden ${ref("valueList")}></div>
            <input
                id="control"
                class=${(_) => PickerParts.control}
                part=${(_) => PickerParts.control}
                role="combobox"
                autocomplete="off"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-controls="listbox"
                ${ref("control")}
            />
            <span class=${(_) => PickerParts.indicator} part=${(_) => PickerParts.indicator} aria-hidden="true">
                <slot name=${(_) => PickerSlots.indicator}>${staticallyCompose(ds.statics.get(PickerStatics.indicator))}</slot>
            </span>
            <slot name=${(_) => PickerSlots.end}></slot>
        </div>
        <span hidden ${ref("removeContent")}>${staticallyCompose(ds.statics.get(PickerStatics.removeValue))}</span>
        <div class=${(_) => PickerParts.popup} part=${(_) => PickerParts.popup} popover="auto" ${ref("popup")}>
            <div id="listbox" class=${(_) => PickerParts.listbox} part=${(_) => PickerParts.listbox} role="listbox" ${ref("listbox")}>
                <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            </div>
            <div class=${(_) => PickerParts.status} part=${(_) => PickerParts.status} role="status">
                <span hidden ${ref("noResults")}><slot name=${(_) => PickerSlots.noResults}>No results</slot></span>
                <span hidden ${ref("loadingStatus")}><slot name=${(_) => PickerSlots.loading}>Loading</slot></span>
            </div>
        </div>
    `;
