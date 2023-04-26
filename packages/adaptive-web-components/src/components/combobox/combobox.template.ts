import { ElementViewTemplate } from "@microsoft/fast-element";
import { comboboxTemplate, FASTCombobox } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the combobox.
 */
export const ComboboxStatics = {
    indicator: "combobox-indicator"
} as const;

export type ComboboxStatics = ValuesOf<typeof ComboboxStatics>;

export const ComboboxConditions = {
};

export const ComboboxParts = {
    control: "control",
    selectedValue: "selected-value",
    indicator: "indicator",
    listbox: "listbox",
};

export const ComboboxAnatomy: ComponentAnatomy<typeof ComboboxConditions, typeof ComboboxParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ComboboxConditions,
    parts: ComboboxParts,
};

/**
 * Default Combobox template, {@link @microsoft/fast-foundation#comboboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCombobox> =
    (ds: DesignSystem) =>
        comboboxTemplate({
            indicator: ds.statics.get(ComboboxStatics.indicator),
        });
