import { type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { hasContent, TextFieldParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import type { TextField } from "./text-field.js";

/**
 * @public
 */
export const TextFieldConditions = {
};

export { TextFieldParts };

/**
 * @public
 */
export const TextFieldAnatomy: ComponentAnatomy<typeof TextFieldConditions, typeof TextFieldParts> = {
    interactivity: controlInteractivity,
    conditions: TextFieldConditions,
    parts: TextFieldParts,
    focus: Focus.partWithin("root", "control"),
};

/**
 * Default Text Field template: the label, and the native `<input>`, whose attributes the element's controller writes.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TextField> =
    (ds: DesignSystem) => html<TextField>`
        <label class="label" part="label" for="control" ?hidden="${x => !hasContent(x.defaultSlottedNodes)}">
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            <slot name="start"></slot>
            <input class="control" part="control" id="control" ${ref("control")} />
            <slot name="end"></slot>
        </div>
    `;
