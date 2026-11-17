import {
    ContractPropertyKind,
    defineDocumentation,
    DocStatus,
    RuleSeverity,
    RuleStance,
} from "@adaptive-web/adaptive-ui";
import { textInputDocumentation } from "../text-input/text-input.documentation.js";

/**
 * Typed component documentation for {@link TextFieldElement}.
 *
 * @public
 */
export const textFieldDocumentation = defineDocumentation({
    id: "textField",
    definition:
        "A **Text Field** is a single-line control for typed text. The host is the form control through `ElementInternals`; a native `<input>` in the shadow root (the `control` part) handles editing, validation, and autofill.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-13",
    },
    disambiguation: [
        {
            id: "textArea",
            use: "Use when the user needs several lines of text, not a single line.",
        },
        {
            id: "search",
            use: "Use when the primary task is searching or filtering, with search-specific behavior and presentation.",
        },
        {
            id: "numberField",
            use: "Use when the value is numeric and stepping or range validation matters.",
        },
    ],
    structure: {
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text in a `<label for>` that names the input.",
            },
            root: {
                description: "Chrome around the control and optional `start` and `end` slots.",
                interactive: true,
                indicatesFocus: true,
                parts: {
                    control: {
                        description: "The native `<input>`; receives DOM focus and shows the text cursor.",
                    },
                },
            },
        },
    },
    contract: {
        include: [textInputDocumentation],
        properties: [
            {
                id: "type",
                kind: ContractPropertyKind.enum,
                description: "The native input `type` and its validation affordances.",
                enumValues: [
                    { id: "text", description: "Plain text." },
                    { id: "email", description: "Email address with built-in format validation." },
                    { id: "password", description: "Concealed text entry." },
                    { id: "tel", label: "Telephone", description: "Telephone number." },
                    { id: "url", label: "URL", description: "URL with built-in format validation." },
                ],
            },
            {
                id: "pattern",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "A regular expression that a valid value matches.",
            },
        ],
        slots: [
            {
                id: "start",
                description: "Optional content before the input, commonly an icon.",
            },
            {
                id: "end",
                description: "Optional content after the input, commonly an icon or affordance.",
            },
        ],
    },
    accessibility: {
        summary:
            "The visible label is associated with the native input. The host forwards author `aria-*` attributes to the input; an external `<label for>` also names the control.",
        responsibilities: [
            "Provide a visible label (`label` or `label` slot), or set `hideLabel` only when another clear accessible name is present.",
            "Do not rely on `placeholder` alone to convey the field's purpose.",
            "Pair validation messages with `aria-describedby` or `aria-errormessage` when showing errors.",
        ],
    },
    capabilities: {
        summary: "Native input editing, constraint validation, autofill, and form participation without product handlers.",
        items: [
            {
                id: "formAssociated",
                description: "Participates in form data and validation through `ElementInternals` on the host.",
            },
            {
                id: "delegatesFocus",
                description: "`delegatesFocus` routes focus from the host and its label to the inner `<input>`.",
            },
            {
                id: "nativeValidation",
                description: "Required, pattern, length, and type constraints surface the input's validity on the host.",
            },
        ],
    },
    usage: {
        rules: [
            {
                id: "labelEveryField",
                stance: RuleStance.do,
                severity: RuleSeverity.must,
                categories: ["a11y-responsibility", "content"],
                text: "Give each field a persistent **label**; use `placeholder` only as a format hint.",
            },
            {
                id: "hideLabelAccessibleName",
                stance: RuleStance.do,
                severity: RuleSeverity.must,
                categories: ["a11y-responsibility", "content"],
                text: "When `hideLabel` is set, keep label text in the `label` slot (visually hidden but still naming the control) or provide an equivalent accessible name.",
            },
            {
                id: "pickTypeIntentionally",
                stance: RuleStance.do,
                severity: RuleSeverity.should,
                categories: ["content"],
                text: "Choose `type` (`email`, `url`, `tel`, `password`) when built-in validation or mobile keyboards help the task.",
            },
            {
                id: "noPlaceholderLabel",
                stance: RuleStance.dont,
                severity: RuleSeverity.must,
                categories: ["a11y-responsibility", "content"],
                text: "Do not use `placeholder` as the only label for a field.",
            },
            {
                id: "noInteractiveInSlots",
                stance: RuleStance.dont,
                severity: RuleSeverity.must,
                categories: ["content"],
                text: "Do not place nested interactive controls in `start` or `end` without a clear focus path and label association.",
            },
        ],
    },
});
