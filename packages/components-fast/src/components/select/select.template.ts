import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import {
    selectDocumentation,
    SelectParts,
    SelectSlots,
    selectWebBinding,
    type ValuesOf,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
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
export const SelectAnatomy = documentationToComponentAnatomy(selectDocumentation, selectWebBinding);

/**
 * Default Select template: the combobox, which shows the selected option, and the popup of the options next to it. The element's controller
 * writes the combobox's state.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Select> =
    (ds: DesignSystem) => html<Select>`
        <span class=${(_) => SelectParts.label} part=${(_) => SelectParts.label} ?hidden="${x => !x.label && !x.labelElements.length}" ${ref("labelPart")}>
            <slot name=${(_) => SelectSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div
            class=${(_) => SelectParts.control}
            part=${(_) => SelectParts.control}
            role="combobox"
            tabindex="0"
            aria-haspopup="listbox"
            aria-controls="listbox"
            ${ref("control")}
        >
            <slot name=${(_) => SelectSlots.start}></slot>
            <span class=${(_) => SelectParts.selectedValue} part=${(_) => SelectParts.selectedValue}>${x => x.selectedText}</span>
            <span class=${(_) => SelectParts.indicator} part=${(_) => SelectParts.indicator} aria-hidden="true">
                <slot name=${(_) => SelectSlots.indicator}>${staticallyCompose(ds.statics.get(SelectStatics.indicator))}</slot>
            </span>
            <slot name=${(_) => SelectSlots.end}></slot>
        </div>
        <div id="listbox" class=${(_) => SelectParts.listbox} part=${(_) => SelectParts.listbox} role="listbox" popover="auto" ${ref("listbox")}>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
    `;
