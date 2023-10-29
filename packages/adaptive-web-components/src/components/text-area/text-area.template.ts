import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTextArea, textAreaTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const TextAreaConditions = {
};

/**
 * @public
 */
export const TextAreaParts = {
    label: "label",
    control: "control",
};

/**
 * @public
 */
export const TextAreaAnatomy: ComponentAnatomy<typeof TextAreaConditions, typeof TextAreaParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TextAreaConditions,
    parts: TextAreaParts,
    focus: Focus.partFocused("control"),
};

/**
 * Default Text Area template, {@link @microsoft/fast-foundation#textAreaTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTextArea> =
    (ds: DesignSystem) =>
        textAreaTemplate();
