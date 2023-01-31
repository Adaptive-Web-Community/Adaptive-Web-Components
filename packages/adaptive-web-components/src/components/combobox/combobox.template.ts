import { ElementViewTemplate } from "@microsoft/fast-element";
import { comboboxTemplate, FASTCombobox } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the combobox indicator.
 */
export const ComboboxIndicatorKey: string = "combobox-indicator";

/**
 * Default Combobox template, {@link @microsoft/fast-foundation#comboboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCombobox> =
    (ds: DesignSystem) =>
        comboboxTemplate({
            indicator: ds.statics.get(ComboboxIndicatorKey),
        });
