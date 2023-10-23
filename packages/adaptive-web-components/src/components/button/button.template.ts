import { ElementViewTemplate } from "@microsoft/fast-element";
import { buttonTemplate, FASTButton } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const ButtonConditions = {
    iconOnly: ".icon-only",
};

/**
 * @public
 */
export const ButtonParts = {
    control: "control",
    content: "content",
};

/**
 * @public
 */
export const ButtonAnatomy: ComponentAnatomy<typeof ButtonConditions, typeof ButtonParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ButtonConditions,
    parts: ButtonParts,
    focus: Focus.partFocused("control"),
};

/**
 * Default Button template, {@link @microsoft/fast-foundation#buttonTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTButton> =
    (ds: DesignSystem) =>
        buttonTemplate();
