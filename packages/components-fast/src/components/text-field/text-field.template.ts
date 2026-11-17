import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import {
    textFieldDocumentation,
    TextFieldParts,
    TextFieldSlots,
    textFieldWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { TextField } from "./text-field.js";

/**
 * @public
 */
export const TextFieldAnatomy = documentationToComponentAnatomy(textFieldDocumentation, textFieldWebBinding);

/**
 * Default Text Field template: the label, and the native `<input>`, whose attributes the element's controller writes.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TextField> =
    (ds: DesignSystem) => html<TextField>`
        <label class=${(_) => TextFieldParts.label} part=${(_) => TextFieldParts.label} for="control" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => TextFieldSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </label>
        <div class=${(_) => TextFieldParts.root} part=${(_) => TextFieldParts.root}>
            <slot name=${(_) => TextFieldSlots.start}></slot>
            <input class=${(_) => TextFieldParts.control} part=${(_) => TextFieldParts.control} id="control" ${ref("control")} />
            <slot name=${(_) => TextFieldSlots.end}></slot>
        </div>
    `;
