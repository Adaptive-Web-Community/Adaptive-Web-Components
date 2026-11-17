import { Focus, type PlatformBindingFor, type StructurePartId } from "@adaptive-web/adaptive-ui";
import { textInputWebConditionSelectors, textInputWebInteractivity } from "../text-input/text-input.web.binding.js";
import { textAreaDocumentation } from "./text-area.documentation.js";

/**
 * Web platform selectors and style hooks for {@link textAreaDocumentation}.
 *
 * @remarks
 * {@link TextAreaParts} documents semantic part ids for templates; this module maps those ids to selectors for styling.
 *
 * @public
 */
export const textAreaWebBinding = {
    conditionSelectors: {
        ...textInputWebConditionSelectors,
        resize: {
            none: ':is(:not([resize]), [resize="none"])',
            both: '[resize="both"]',
            horizontal: '[resize="horizontal"]',
            vertical: '[resize="vertical"]',
        },
    },
    partSelectors: {
        label: ".label",
        control: ".control",
    },
    interactivity: textInputWebInteractivity,
    focus: Focus.partFocused<Record<StructurePartId<typeof textAreaDocumentation.structure>, string>>("control"),
    cursor: {
        part: "control",
        cursorType: "text",
    },
} satisfies PlatformBindingFor<typeof textAreaDocumentation>;
