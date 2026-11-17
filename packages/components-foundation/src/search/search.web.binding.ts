import { Focus, type PlatformBindingFor, type StructurePartId } from "@adaptive-web/adaptive-ui";
import { textInputWebConditionSelectors, textInputWebInteractivity } from "../text-input/text-input.web.binding.js";
import { searchDocumentation } from "./search.documentation.js";

/**
 * Web platform selectors and style hooks for {@link searchDocumentation}.
 *
 * @remarks
 * {@link SearchParts} documents semantic part ids for templates; this module maps those ids to selectors for styling.
 *
 * @public
 */
export const searchWebBinding = {
    conditionSelectors: textInputWebConditionSelectors,
    partSelectors: {
        label: ".label",
        root: ".root",
        inputWrapper: ".input-wrapper",
        control: ".control",
        clearButton: ".clear-button",
    },
    interactivity: textInputWebInteractivity,
    focus: Focus.partWithin<Record<StructurePartId<typeof searchDocumentation.structure>, string>>("root", "control"),
    cursor: {
        part: "control",
        cursorType: "text",
    },
} satisfies PlatformBindingFor<typeof searchDocumentation>;
