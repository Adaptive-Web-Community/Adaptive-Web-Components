import { ElementViewTemplate } from "@microsoft/fast-element";
import { dialogTemplate, FASTDialog } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const DialogConditions = {
};

/**
 * @public
 */
export const DialogParts = {
    positioningRegion: "positioning-region",
    overlay: "overlay",
    control: "control",
};

/**
 * @public
 */
export const DialogAnatomy: ComponentAnatomy<typeof DialogConditions, typeof DialogParts> = {
    interactivity: Interactivity.never,
    conditions: DialogConditions,
    parts: DialogParts,
};

/**
 * Default Dialog template, {@link @microsoft/fast-foundation#dialogTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDialog> =
    (ds: DesignSystem) =>
        dialogTemplate();
