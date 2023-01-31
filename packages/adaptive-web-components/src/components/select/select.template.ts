import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSelect, selectTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the select indicator.
 */
export const SelectIndicatorKey: string = "select-indicator";

/**
 * Default Select template, {@link @microsoft/fast-foundation#selectTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSelect> =
    (ds: DesignSystem) =>
        selectTemplate({
            indicator: ds.statics.get(SelectIndicatorKey),
        });
