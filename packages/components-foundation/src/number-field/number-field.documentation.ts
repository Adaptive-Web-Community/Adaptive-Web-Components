import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { textInputDocumentation } from "../text-input/text-input.documentation.js";

/**
 * Typed component documentation for {@link NumberFieldElement}.
 *
 * @public
 */
export const numberFieldDocumentation = defineDocumentation({
    id: "numberField",
    definition:
        "A **Number Field** is a field that the user types a number in. It is a text input around a native `<input type=\"number\">`, which parses the number, steps it with the arrow keys, and validates its range and step. Its step buttons are for the pointer, not the tab order, since the arrow keys step.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-16",
    },
    disambiguation: [
        {
            id: "textField",
            use: "Use when the value is text, or a number that is an identifier (a postal code) rather than a quantity.",
        },
        {
            id: "slider",
            use: "Use when the user picks a value within a range by direction and approximate position, not by typing it.",
        },
    ],
    structure: {
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text in a `<label for>` that names the control.",
            },
            root: {
                description: "The box around the control, the step buttons, and the `start` and `end` slots.",
                interactive: true,
                indicatesFocus: true,
                parts: {
                    control: {
                        description: "The native `<input type=\"number\">`; receives DOM focus and shows the text cursor.",
                    },
                    controls: {
                        description: "The step buttons, hidden from assistive technology since the arrow keys step.",
                        parts: {
                            stepUp: {
                                description: "The button that steps up.",
                                interactive: true,
                            },
                            stepDown: {
                                description: "The button that steps down.",
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
                id: "min",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The least valid value.",
            },
            {
                id: "max",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The greatest valid value.",
            },
            {
                id: "step",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The step between valid values, from `min`. The default is 1, as a native number input's.",
            },
            {
                id: "hideStep",
                kind: ContractPropertyKind.boolean,
                description: "Whether the step buttons are hidden.",
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
                id: "step-up-glyph",
                description: "Replaces the glyph of the button that steps up.",
            },
            {
                id: "step-down-glyph",
                description: "Replaces the glyph of the button that steps down.",
            },
        ],
    },
    accessibility: {
        summary:
            "The label is associated with the native input, which has the `spinbutton` role. The arrow keys step the value, so the step buttons are out of the tab order and hidden from assistive technology.",
        responsibilities: [
            "Provide a visible label (`label` or the `label` slot), or set `hideLabel` only when another clear accessible name is present.",
            "Do not rely on `placeholder` alone to convey the field's purpose.",
        ],
    },
    capabilities: {
        summary: "Native number parsing, stepping, range validation, and form participation without product handlers.",
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
                description: "Range, step, and bad input constraints surface the input's validity on the host (`rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`).",
            },
            {
                id: "stepping",
                description: "`stepUp()` and `stepDown()` step the value as the step buttons do, emitting `input` and `change`.",
            },
        ],
    },
});
