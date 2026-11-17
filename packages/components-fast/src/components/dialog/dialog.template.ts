import { type ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { dialogDocumentation, DialogParts, dialogWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Dialog } from "./dialog.js";

/**
 * @public
 */
export const DialogAnatomy = documentationToComponentAnatomy(dialogDocumentation, dialogWebBinding);

/**
 * Default Dialog template: the native `<dialog>`, which has the role, the top layer, and the backdrop (`::backdrop` of the `control`
 * part).
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Dialog> =
    (ds: DesignSystem) => html<Dialog>`
        <dialog class=${(_) => DialogParts.control} part=${(_) => DialogParts.control} ${ref("control")}>
            <slot></slot>
        </dialog>
    `;
