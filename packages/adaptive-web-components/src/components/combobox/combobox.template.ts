import { ElementViewTemplate } from "@microsoft/fast-element";
import { comboboxTemplate, FASTCombobox } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the combobox.
 *
 * @beta
 */
export const ComboboxStatics = {
    indicator: "combobox-indicator"
} as const;

/**
 * @beta
 */
export type ComboboxStatics = ValuesOf<typeof ComboboxStatics>;

/**
 * @public
 */
export const ComboboxConditions = {
};

/**
 * @public
 */
export const ComboboxParts = {
    control: "control",
    selectedValue: "selected-value",
    indicator: "indicator",
    listbox: "listbox",
};

/**
 * @public
 */
export const ComboboxAnatomy: ComponentAnatomy<typeof ComboboxConditions, typeof ComboboxParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ComboboxConditions,
    parts: ComboboxParts,
};

/**
 * Default Combobox template, {@link @microsoft/fast-foundation#comboboxTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCombobox> =
    (ds: DesignSystem) =>
        comboboxTemplate({
            indicator: ds.statics.get(ComboboxStatics.indicator),
        });
