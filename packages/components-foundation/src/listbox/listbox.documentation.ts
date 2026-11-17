import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link ListboxElement}.
 *
 * @public
 */
export const listboxDocumentation = defineDocumentation({
    id: "listbox",
    definition:
        "A **Listbox** is a list of options of which one or any number are selected (`role=\"listbox\"`), as a native `<select>` that shows its options. The host takes focus and points at the active option.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the listbox; the options part contains the default slot.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text that names the listbox, hidden from assistive technology so it isn't read twice.",
            },
            options: {
                description: "The box of the options, which scrolls.",
                interactive: true,
                indicatesFocus: true,
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
                description: "Whether any number of options can be selected, or one.",
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
                description: "Whether it is read only: the keys move between options, and the user can't change the selection.",
            },
            {
                id: "required",
                kind: ContractPropertyKind.boolean,
                description: "Whether an option must be selected for its form to be valid.",
            },
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description: "The value of the first selected option, or an empty string when none is.",
            },
        ],
        slots: [],
    },
});
