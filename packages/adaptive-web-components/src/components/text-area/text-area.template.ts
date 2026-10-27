import { type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { hasContent, TextAreaParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import type { TextArea } from "./text-area.js";

/**
 * @public
 */
export const TextAreaConditions = {
};

export { TextAreaParts };

/**
 * @public
 */
export const TextAreaAnatomy: ComponentAnatomy<typeof TextAreaConditions, typeof TextAreaParts> = {
    interactivity: controlInteractivity,
    conditions: TextAreaConditions,
    parts: TextAreaParts,
    focus: Focus.partFocused("control"),
};

/**
 * Default Text Area template: the label, and the native `<textarea>`, whose attributes the element's controller writes.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TextArea> =
    (ds: DesignSystem) => html<TextArea>`
        <label class="label" part="label" for="control" ?hidden="${x => !hasContent(x.defaultSlottedNodes)}">
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <textarea class="control" part="control" id="control" ${ref("control")}></textarea>
    `;
