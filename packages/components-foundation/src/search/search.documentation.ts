import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { textInputDocumentation } from "../text-input/text-input.documentation.js";

/**
 * Typed component documentation for {@link SearchElement}.
 *
 * @public
 */
export const searchDocumentation = defineDocumentation({
    id: "search",
    definition:
        "A **Search** is a field that the user types a search in. It is a text input around a native `<input type=\"search\">` (the `searchbox` role), with a clear button. The clear button is for the pointer, not the tab order: Escape clears a search field.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-16",
    },
    disambiguation: [
        {
            id: "textField",
            use: "Use for a value that is entered into a form, not a query that searches or filters.",
        },
    ],
    structure: {
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text in a `<label for>` that names the control.",
            },
            root: {
                description: "The box around the control, the clear button, and the `start` and `end` slots.",
                interactive: true,
                indicatesFocus: true,
                parts: {
                    inputWrapper: {
                        description: "Wraps the control and the clear button.",
                        parts: {
                            control: {
                                description: "The native `<input type=\"search\">`; receives DOM focus and shows the text cursor.",
                            },
                            clearButton: {
                                description: "The button that clears the value, hidden without a value or when read only.",
                                interactive: true,
                            },
                        },
                    },
                },
            },
        },
    },
    contract: {
        include: [textInputDocumentation],
        properties: [
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
                description: "Optional content before the control, commonly an icon.",
            },
            {
                id: "end",
                description: "Optional content after the control, commonly an icon or affordance.",
            },
            {
                id: "clear-glyph",
                description: "Replaces the glyph of the clear button.",
            },
        ],
    },
    accessibility: {
        summary:
            "The label is associated with the native input, which has the `searchbox` role. Escape clears the value, so the clear button is out of the tab order and hidden from assistive technology.",
        responsibilities: [
            "Provide a visible label (`label` or the `label` slot), or set `hideLabel` only when another clear accessible name is present.",
            "Do not rely on `placeholder` alone to convey the field's purpose.",
        ],
    },
    capabilities: {
        summary: "Native search input editing, constraint validation, clearing, and form participation without product handlers.",
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
                id: "clearing",
                description: "`clear()` and Escape empty the value, emitting `input` and `change`, and focus the field.",
            },
        ],
    },
});
