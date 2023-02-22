import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTRadio, radioTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the radio.
 */
export const RadioStatics = {
    checked: "radio-checked-indicator"
} as const;

export type RadioStatics = ValuesOf<typeof RadioStatics>;

/**
 * Default Radio template, {@link @microsoft/fast-foundation#radioTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTRadio> =
    (ds: DesignSystem) =>
        radioTemplate({
            checkedIndicator: ds.statics.get(RadioStatics.checked),
        });
