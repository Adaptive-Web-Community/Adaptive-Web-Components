import { ElementViewTemplate } from "@microsoft/fast-element";
import { comboboxTemplate, FASTCombobox } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the combobox indicator.
 */
export const ComboboxIconKeys = {
    indicator: "combobox-indicator"
} as const;

export type ComboboxIconKeys = ValuesOf<typeof ComboboxIconKeys>;

/**
 * Default Combobox template, {@link @microsoft/fast-foundation#comboboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCombobox> =
    (ds: DesignSystem) =>
        comboboxTemplate({
            indicator: ds.statics.get(ComboboxIconKeys.indicator),
        });
