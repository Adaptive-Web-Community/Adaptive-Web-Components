import { type ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { DialogParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Dialog } from "./dialog.js";

/**
 * @public
 */
export const DialogConditions = {
    modal: ":state(modal)",
};

export { DialogParts };

/**
 * @public
 */
export const DialogAnatomy: ComponentAnatomy<typeof DialogConditions, typeof DialogParts> = {
    interactivity: Interactivity.never,
    conditions: DialogConditions,
    parts: DialogParts,
};

/**
 * Default Dialog template: the native `<dialog>`, which has the role, the top layer, and the backdrop (`::backdrop` of the `control`
 * part).
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Dialog> =
    (ds: DesignSystem) => html<Dialog>`
        <dialog class="control" part="control" ${ref("control")}>
            <slot></slot>
        </dialog>
    `;
