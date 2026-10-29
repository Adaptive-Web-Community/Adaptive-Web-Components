import { refs } from "design-token-library";
import { ComponentAnatomy, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const { color } = refs<ReferenceLibraryTokens>();

// Stress test for the selectors generated for contexts, parts, conditions, and custom interactive states.

export const StressSelectorsConditions = {
    size: {
        small: ".size-small",
        large: ".size-large",
    },
    selected: "[aria-selected='true']",
};

export const StressSelectorsParts = {
    content: ".content",
    label: ".label",
    decoration: "::before",
    exported: "::part(icon)",
    everything: "*",
    // Resolves to the same element as the context
    self: ".stress-selectors",
};

export const StressSelectorsAnatomy: ComponentAnatomy<typeof StressSelectorsConditions, typeof StressSelectorsParts> = {
    name: "StressSelectors",
    context: ".stress-selectors",
    conditions: StressSelectorsConditions,
    parts: StressSelectorsParts,
    // Custom selectors for every state
    interactivity: {
        interactive: ":not(.locked)",
        disabled: ".locked",
        hover: ".is-hovered",
        active: ".is-active",
        focus: ".is-focused",
    },
    focus: {
        focusTarget: {
            part: StressSelectorsParts.content,
            ignoreInteractivity: true,
        },
    },
};

export const stressSelectorsStyleModules: StyleRules = [
    // Interactive token set on the context
    {
        properties: {
            backgroundFill: color.neutral.fill.subtle,
            foregroundFill: color.neutral.stroke.readable,
        },
    },
    // String condition values
    {
        target: {
            contextCondition: StressSelectorsAnatomy.conditions.size.small,
        },
        properties: { gap: "4px" },
    },
    {
        target: {
            contextCondition: StressSelectorsAnatomy.conditions.size.large,
        },
        properties: { gap: "16px" },
    },
    // Boolean condition with a part
    {
        target: {
            contextCondition: StressSelectorsAnatomy.conditions.selected,
            part: StressSelectorsAnatomy.parts.content,
        },
        properties: { backgroundFill: color.neutral.fill.subtle },
    },
    // The state applies to the context, not the part
    {
        target: {
            part: StressSelectorsAnatomy.parts.label,
            stateOnContext: true,
        },
        properties: { foregroundFill: color.neutral.stroke.readable },
    },
    // A condition on the part
    {
        target: {
            part: StressSelectorsAnatomy.parts.label,
            partCondition: ".dim",
        },
        properties: { opacity: 0.6 },
    },
    // Pseudo element and exported part selectors
    {
        target: {
            part: StressSelectorsAnatomy.parts.decoration,
        },
        properties: { backgroundFill: color.neutral.fill.subtle },
    },
    {
        target: {
            part: StressSelectorsAnatomy.parts.exported,
        },
        properties: { foregroundFill: color.neutral.stroke.readable },
    },
    // All descendants
    {
        target: {
            part: StressSelectorsAnatomy.parts.everything,
        },
        properties: { opacity: 0.9 },
    },
    // A part that is the same as the context collapses to the context
    {
        target: {
            part: StressSelectorsAnatomy.parts.self,
        },
        properties: { opacity: 1 },
    },
    // A different context for a single rule
    {
        target: {
            context: ".other-context",
            contextCondition: ".other-condition",
        },
        properties: { backgroundFill: color.neutral.fill.subtle },
    },
    // Ignores the interactivity of the component, so there's no interactive condition on the states
    {
        target: {
            part: StressSelectorsAnatomy.parts.content,
            ignoreInteractivity: true,
        },
        properties: { backgroundFill: color.neutral.fill.subtle },
    },
];
