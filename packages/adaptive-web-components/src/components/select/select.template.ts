import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSelect, selectTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the select.
 */
export const SelectStatics = {
    indicator: "select-indicator"
} as const;

export type SelectStatics = ValuesOf<typeof SelectStatics>;

export const SelectConditions = {
};

export const SelectParts = {
    control: "control",
    selectedValue: "selected-value",
    indicator: "indicator",
    listbox: "listbox",
};

export const SelectAnatomy: ComponentAnatomy<typeof SelectConditions, typeof SelectParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: SelectConditions,
    parts: SelectParts,
};

/**
 * Default Select template, {@link @microsoft/fast-foundation#selectTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSelect> =
    (ds: DesignSystem) =>
        selectTemplate({
            indicator: ds.statics.get(SelectStatics.indicator),
        });
