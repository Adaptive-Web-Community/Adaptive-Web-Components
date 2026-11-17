import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { textInputDocumentation } from "../text-input/text-input.documentation.js";

/**
 * Typed component documentation for {@link TextAreaElement}.
 *
 * @public
 */
export const textAreaDocumentation = defineDocumentation({
    id: "textArea",
    definition:
        "A **Text Area** is a field of several lines that the user types text in. It is a text input around a native `<textarea>`, which receives the focus and handles editing, validation, and autofill. Enter starts a line; it doesn't submit the form.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-16",
    },
    disambiguation: [
        {
            id: "textField",
            use: "Use for a single line of typed text.",
        },
    ],
    structure: {
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text in a `<label for>` that names the control.",
            },
            control: {
                description: "The native `<textarea>`; receives DOM focus and shows the text cursor.",
                interactive: true,
                indicatesFocus: true,
            },
        },
    },
    contract: {
        include: [textInputDocumentation],
        properties: [
            {
                id: "rows",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The lines it shows.",
            },
            {
                id: "cols",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The characters of a line it shows.",
            },
            {
                id: "resize",
                kind: ContractPropertyKind.enum,
                description: "How the user can resize it. The template's styles do it. The default is `none`.",
                enumValues: [
                    { id: "none", description: "The user can't resize it." },
                    { id: "both", description: "The user can resize it in both directions." },
                    { id: "horizontal", description: "The user can resize its width." },
                    { id: "vertical", description: "The user can resize its height." },
                ],
            },
        ],
        slots: [],
    },
    accessibility: {
        summary:
            "The label is associated with the native `<textarea>`. The host forwards author `aria-*` attributes to it; an external `<label for>` also names the control.",
        responsibilities: [
            "Provide a visible label (`label` or the `label` slot), or set `hideLabel` only when another clear accessible name is present.",
            "Do not rely on `placeholder` alone to convey the field's purpose.",
        ],
    },
    capabilities: {
        summary: "Native textarea editing, constraint validation, autofill, and form participation without product handlers.",
        items: [
            {
                id: "formAssociated",
                description: "Participates in form data and validation through `ElementInternals` on the host.",
            },
            {
                id: "delegatesFocus",
                description: "`delegatesFocus` routes focus from the host and its label to the inner `<textarea>`.",
            },
            {
                id: "multiline",
                description: "Enter starts a line; there is no implicit form submission.",
            },
        ],
    },
});
