import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTextField, textFieldTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const TextFieldConditions = {
};

export const TextFieldParts = {
    label: "label",
    root: "root",
    control: "control",
};

export const TextFieldAnatomy: ComponentAnatomy<typeof TextFieldConditions, typeof TextFieldParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TextFieldConditions,
    parts: TextFieldParts,
};

/**
 * Default Text Field template, {@link @microsoft/fast-foundation#textFieldTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTextField> =
    (ds: DesignSystem) =>
        textFieldTemplate();
