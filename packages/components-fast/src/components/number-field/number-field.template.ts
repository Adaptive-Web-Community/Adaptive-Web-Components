import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import {
    numberFieldDocumentation,
    NumberFieldParts,
    NumberFieldSlots,
    numberFieldWebBinding,
    type ValuesOf,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { NumberField } from "./number-field.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the number field.
 *
 * @public
 */
export const NumberFieldStatics = {
    stepDown: "number-field-step-down-icon",
    stepUp: "number-field-step-up-icon"
} as const;

/**
 * @public
 */
export type NumberFieldStatics = ValuesOf<typeof NumberFieldStatics>;

/**
 * @public
 */
export const NumberFieldAnatomy = documentationToComponentAnatomy(numberFieldDocumentation, numberFieldWebBinding);

/**
 * Default Number Field template: the label, the native `<input type="number">`, whose attributes the element's controller writes, and the
 * step buttons, which are for the pointer: the arrow keys step.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<NumberField> =
    (ds: DesignSystem) => html<NumberField>`
        <label class=${(_) => NumberFieldParts.label} part=${(_) => NumberFieldParts.label} for="control" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => NumberFieldSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </label>
        <div class=${(_) => NumberFieldParts.root} part=${(_) => NumberFieldParts.root}>
            <slot name=${(_) => NumberFieldSlots.start}></slot>
            <input class=${(_) => NumberFieldParts.control} part=${(_) => NumberFieldParts.control} id="control" ${ref("control")} />
            <div class=${(_) => NumberFieldParts.controls} part=${(_) => NumberFieldParts.controls} aria-hidden="true" ?hidden="${x => x.hideStep || x.readOnly}">
                <div class=${(_) => NumberFieldParts.stepUp} part=${(_) => NumberFieldParts.stepUp} @click="${x => x.stepUp()}">
                    <slot name=${(_) => NumberFieldSlots.stepUpGlyph}>${staticallyCompose(ds.statics.get(NumberFieldStatics.stepUp))}</slot>
                </div>
                <div class=${(_) => NumberFieldParts.stepDown} part=${(_) => NumberFieldParts.stepDown} @click="${x => x.stepDown()}">
                    <slot name=${(_) => NumberFieldSlots.stepDownGlyph}>${staticallyCompose(ds.statics.get(NumberFieldStatics.stepDown))}</slot>
                </div>
            </div>
            <slot name=${(_) => NumberFieldSlots.end}></slot>
        </div>
    `;
