import { Focus, type PlatformBindingFor, type StructurePartId } from "@adaptive-web/adaptive-ui";
import { textInputWebConditionSelectors, textInputWebInteractivity } from "../text-input/text-input.web.binding.js";
import { textFieldDocumentation } from "./text-field.documentation.js";

/**
 * Web platform selectors and style hooks for {@link textFieldDocumentation}.
 *
 * @remarks
 * {@link TextFieldParts} documents semantic part ids for templates; this module maps those ids to selectors for styling.
 *
 * @public
 */
export const textFieldWebBinding = {
    conditionSelectors: {
        ...textInputWebConditionSelectors,
        type: {
            text: ':is(:not([type]), [type="text"])',
            email: '[type="email"]',
            password: '[type="password"]',
            tel: '[type="tel"]',
            url: '[type="url"]',
        },
    },
    partSelectors: {
        label: ".label",
        root: ".root",
        control: ".control",
    },
    interactivity: textInputWebInteractivity,
    focus: Focus.partWithin<Record<StructurePartId<typeof textFieldDocumentation.structure>, string>>("root", "control"),
    cursor: {
        part: "control",
        cursorType: "text",
    },
} satisfies PlatformBindingFor<typeof textFieldDocumentation>;
