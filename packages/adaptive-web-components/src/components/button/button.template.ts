import { ElementViewTemplate } from "@microsoft/fast-element";
import { buttonTemplate, FASTButton } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const ButtonConditions = {
    iconOnly: ".icon-only",
};

export const ButtonParts = {
    control: "control",
    content: "content",
};

export const ButtonAnatomy: ComponentAnatomy<typeof ButtonConditions, typeof ButtonParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ButtonConditions,
    parts: ButtonParts,
};

/**
 * Default Button template, {@link @microsoft/fast-foundation#buttonTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTButton> =
    (ds: DesignSystem) =>
        buttonTemplate();
