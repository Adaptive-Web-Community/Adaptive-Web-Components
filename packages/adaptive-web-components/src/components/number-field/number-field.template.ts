import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { NumberFieldParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { NumberField } from "./number-field.js";

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

export { NumberFieldParts };

/**
 * @public
 */
export const NumberFieldAnatomy: ComponentAnatomy<typeof NumberFieldConditions, typeof NumberFieldParts> = {
    interactivity: controlInteractivity,
    conditions: NumberFieldConditions,
    parts: NumberFieldParts,
    focus: Focus.partWithin("root", "control"),
};

/**
 * Default Number Field template: the label, the native `<input type="number">`, whose attributes the element's controller writes, and the
 * step buttons, which are for the pointer: the arrow keys step.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<NumberField> =
    (ds: DesignSystem) => html<NumberField>`
        <label class="label" part="label" for="control" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </label>
        <div class="root" part="root">
            <slot name="start"></slot>
            <input class="control" part="control" id="control" ${ref("control")} />
            <div class="controls" part="controls" aria-hidden="true" ?hidden="${x => x.hideStep || x.readOnly}">
                <div class="step-up" part="step-up" @click="${x => x.stepUp()}">
                    <slot name="step-up-glyph">${staticallyCompose(ds.statics.get(NumberFieldStatics.stepUp))}</slot>
                </div>
                <div class="step-down" part="step-down" @click="${x => x.stepDown()}">
                    <slot name="step-down-glyph">${staticallyCompose(ds.statics.get(NumberFieldStatics.stepDown))}</slot>
                </div>
            </div>
            <slot name="end"></slot>
        </div>
    `;
