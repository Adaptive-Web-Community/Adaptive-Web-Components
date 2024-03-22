import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSelect, selectTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the select.
 *
 * @beta
 */
export const SelectStatics = {
    indicator: "select-indicator"
} as const;

/**
 * @beta
 */
export type SelectStatics = ValuesOf<typeof SelectStatics>;

/**
 * @public
 */
export const SelectConditions = {
    isDropdown: "[aria-haspopup]",
    isListbox: ":not([aria-haspopup])",
};

/**
 * @public
 */
export const SelectParts = {
    control: "control",
    selectedValue: "selected-value",
    indicator: "indicator",
    listbox: "listbox",
};

/**
 * @public
 */
export const SelectAnatomy: ComponentAnatomy<typeof SelectConditions, typeof SelectParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: SelectConditions,
    parts: SelectParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Select template, {@link @microsoft/fast-foundation#selectTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSelect> =
    (ds: DesignSystem) =>
        selectTemplate({
            indicator: ds.statics.get(SelectStatics.indicator),
        });
