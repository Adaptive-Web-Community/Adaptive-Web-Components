import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSelect, selectTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the select icons.
 */
export const SelectIconKeys = {
    indicator: "select-indicator"
} as const;

export type SelectIconKeys = ValuesOf<typeof SelectIconKeys>;

/**
 * Default Select template, {@link @microsoft/fast-foundation#selectTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSelect> =
    (ds: DesignSystem) =>
        selectTemplate({
            indicator: ds.statics.get(SelectIconKeys.indicator),
        });
