import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTNumberField, numberFieldTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the number field.
 *
 * @beta
 */
export const NumberFieldStatics = {
    stepDown: "number-field-step-down-icon",
    stepUp: "number-field-step-up-icon"
} as const;

/**
 * @beta
 */
export type NumberFieldStatics = ValuesOf<typeof NumberFieldStatics>;

/**
 * @public
 */
export const NumberFieldConditions = {
};

/**
 * @public
 */
export const NumberFieldParts = {
    label: "label",
    root: "root",
    control: "control",
    controls: "controls",
    stepUp: "step-up",
    stepDown: "step-down",
};

/**
 * @public
 */
export const NumberFieldAnatomy: ComponentAnatomy<typeof NumberFieldConditions, typeof NumberFieldParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: NumberFieldConditions,
    parts: NumberFieldParts,
};

/**
 * Default Number Field template, {@link @microsoft/fast-foundation#numberFieldTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTNumberField> =
    (ds: DesignSystem) =>
        numberFieldTemplate({
            stepDownGlyph: ds.statics.get(NumberFieldStatics.stepDown),
            stepUpGlyph: ds.statics.get(NumberFieldStatics.stepUp),
        });
