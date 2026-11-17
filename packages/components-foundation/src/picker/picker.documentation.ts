import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link PickerElement}.
 *
 * @public
 */
export const pickerDocumentation = defineDocumentation({
    id: "picker",
    definition:
        "A **Picker** is a combobox that suggests options from a popup as the user types, and takes one value or several listed before the input.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text in a `<label for>` that names the control.",
            },
            root: {
                description: "The box of the field, around the values and the input.",
                interactive: true,
                indicatesFocus: true,
                parts: {
                    values: {
                        description: "The list of the values (`role=\"list\"`), before the input, in multiple selection.",
                    },
                    value: {
                        description: "A value in the list (`role=\"listitem\"`).",
                    },
                    valueLabel: {
                        description: "The label of a value.",
                    },
                    valueRemove: {
                        description: "The button that removes a value, for the pointer.",
                    },
                    control: {
                        description: "The native input (`role=\"combobox\"`), which has the focus.",
                    },
                    indicator: {
                        description: "The indicator that it opens.",
                    },
                },
            },
            popup: {
                description: "The popup, a popover anchored to the root, with the listbox and the status.",
                parts: {
                    listbox: {
                        description: "The list of the options (`role=\"listbox\"`).",
                    },
                    status: {
                        description: "The status of the popup (`role=\"status\"`): loading or no results.",
                    },
                },
            },
        },
    },
    contract: {
        include: [labelledDocumentation],
        properties: [
            {
                id: "name",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The name of its values in the form data.",
            },
            {
                id: "multiple",
                kind: ContractPropertyKind.boolean,
                description: "Whether it takes any number of values, or one.",
            },
            {
                id: "freeform",
                kind: ContractPropertyKind.boolean,
                description: "Whether it takes values that aren't options: the text typed.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.",
            },
            {
                id: "readOnly",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is read only: the user can't change its values.",
            },
            {
                id: "required",
                kind: ContractPropertyKind.boolean,
                description: "Whether a value is needed for its form to be valid.",
            },
            {
                id: "loading",
                kind: ContractPropertyKind.boolean,
                description: "Whether the author is finding options; the status says so.",
            },
            {
                id: "placeholder",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The text shown in the empty input.",
            },
            {
                id: "open",
                kind: ContractPropertyKind.boolean,
                description: "Whether the popup is open.",
            },
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description: "The first value, or an empty string without one.",
            },
        ],
        slots: [
            {
                id: "start",
                description: "Optional content before the input in the root.",
            },
            {
                id: "end",
                description: "Optional content after the indicator in the root.",
            },
            {
                id: "indicator",
                description: "Replaces the default open indicator.",
            },
            {
                id: "no-results",
                description: "Replaces the default no-results text in the status.",
            },
            {
                id: "loading",
                description: "Replaces the default loading text in the status.",
            },
        ],
    },
});
