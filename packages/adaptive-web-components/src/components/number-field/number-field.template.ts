import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTNumberField, numberFieldTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the number field step down icon.
 */
export const NumberFieldStepDownIconKey: string = "number-field-step-down-icon";

/**
 * Key for {@link DesignSystem} `statics` registration for the number field step up icon.
 */
export const NumberFieldStepUpIconKey: string = "number-field-step-up-icon";

/**
 * Default Number Field template, {@link @microsoft/fast-foundation#numberFieldTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTNumberField> =
    (ds: DesignSystem) =>
        numberFieldTemplate({
            stepDownGlyph: ds.statics.get(NumberFieldStepDownIconKey),
            stepUpGlyph: ds.statics.get(NumberFieldStepUpIconKey),
        });
