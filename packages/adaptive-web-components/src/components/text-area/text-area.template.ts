import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTextArea, textAreaTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const TextAreaConditions = {
};

export const TextAreaParts = {
    label: "label",
    control: "control",
};

export const TextAreaAnatomy: ComponentAnatomy<typeof TextAreaConditions, typeof TextAreaParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TextAreaConditions,
    parts: TextAreaParts,
};

/**
 * Default Text Area template, {@link @microsoft/fast-foundation#textAreaTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTextArea> =
    (ds: DesignSystem) =>
        textAreaTemplate();
