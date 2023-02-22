import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTNumberField, numberFieldTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the number field.
 */
export const NumberFieldStatics = {
    stepDown: "number-field-step-down-icon",
    stepUp: "number-field-step-up-icon"
} as const;

export type NumberFieldStatics = ValuesOf<typeof NumberFieldStatics>;

/**
 * Default Number Field template, {@link @microsoft/fast-foundation#numberFieldTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTNumberField> =
    (ds: DesignSystem) =>
        numberFieldTemplate({
            stepDownGlyph: ds.statics.get(NumberFieldStatics.stepDown),
            stepUpGlyph: ds.statics.get(NumberFieldStatics.stepUp),
        });
