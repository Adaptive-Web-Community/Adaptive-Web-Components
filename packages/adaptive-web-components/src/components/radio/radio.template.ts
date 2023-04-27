import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTRadio, radioTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the radio.
 */
export const RadioStatics = {
    checked: "radio-checked-indicator"
} as const;

export type RadioStatics = ValuesOf<typeof RadioStatics>;

export const RadioConditions = {
    checked: "[aria-checked='true']",
};

export const RadioParts = {
    control: "control",
    label: "label",
};

export const RadioAnatomy: ComponentAnatomy<typeof RadioConditions, typeof RadioParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: RadioConditions,
    parts: RadioParts,
};

/**
 * Default Radio template, {@link @microsoft/fast-foundation#radioTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTRadio> =
    (ds: DesignSystem) =>
        radioTemplate({
            checkedIndicator: ds.statics.get(RadioStatics.checked),
        });
