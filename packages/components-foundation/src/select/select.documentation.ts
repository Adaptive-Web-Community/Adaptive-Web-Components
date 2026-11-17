import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link SelectElement}.
 *
 * @public
 */
export const selectDocumentation = defineDocumentation({
    id: "select",
    definition:
        "A **Select** is a combobox that shows the selected option and opens a popup of options (`role=\"combobox\"`), as a native `<select>`. The host is the form control.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text that names the select.",
            },
            control: {
                description: "The combobox, which has the focus and shows the selected option.",
                interactive: true,
                indicatesFocus: true,
                parts: {
                    selectedValue: {
                        description: "The text of the selected option, in the control.",
                    },
                    indicator: {
                        description: "The indicator that it opens, in the control.",
                    },
                },
            },
            listbox: {
                description: "The popup of the options (`role=\"listbox\"`), a popover anchored to the control.",
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
                description: "The name of its value in the form data.",
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
                description: "Whether it is read only: it opens, and the keys move, but the user can't select.",
            },
            {
                id: "required",
                kind: ContractPropertyKind.boolean,
                description: "Whether an option with a value must be selected for its form to be valid.",
            },
            {
                id: "open",
                kind: ContractPropertyKind.boolean,
                description: "Whether the popup is open.",
            },
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description: "The value of the selected option, or an empty string when none is.",
            },
        ],
        slots: [
            {
                id: "start",
                description: "Optional content before the selected value in the control.",
            },
            {
                id: "end",
                description: "Optional content after the indicator in the control.",
            },
            {
                id: "indicator",
                description: "Replaces the default open indicator in the control.",
            },
        ],
    },
});
