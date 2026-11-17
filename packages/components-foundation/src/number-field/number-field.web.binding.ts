import { Focus, type PlatformBindingFor, type StructurePartId } from "@adaptive-web/adaptive-ui";
import { textInputWebConditionSelectors, textInputWebInteractivity } from "../text-input/text-input.web.binding.js";
import { numberFieldDocumentation } from "./number-field.documentation.js";

/**
 * Web platform selectors and style hooks for {@link numberFieldDocumentation}.
 *
 * @remarks
 * {@link NumberFieldParts} documents semantic part ids for templates; this module maps those ids to selectors for styling.
 *
 * @public
 */
export const numberFieldWebBinding = {
    conditionSelectors: {
        ...textInputWebConditionSelectors,
        hideStep: "[hide-step]",
    },
    partSelectors: {
        label: ".label",
        root: ".root",
        control: ".control",
        controls: ".controls",
        stepUp: ".step-up",
        stepDown: ".step-down",
    },
    interactivity: textInputWebInteractivity,
    focus: Focus.partWithin<Record<StructurePartId<typeof numberFieldDocumentation.structure>, string>>("root", "control"),
    cursor: {
        part: "control",
        cursorType: "text",
    },
} satisfies PlatformBindingFor<typeof numberFieldDocumentation>;
