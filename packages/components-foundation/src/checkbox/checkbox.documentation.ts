import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { checkableDocumentation } from "../checkable/checkable.documentation.js";

/**
 * Typed component documentation for {@link CheckboxElement}.
 *
 * @public
 */
export const checkboxDocumentation = defineDocumentation({
    id: "checkbox",
    definition:
        "A **Checkbox** is a control the user checks and unchecks, which can be indeterminate. The host is the checkbox (`role=\"checkbox\"`) and the form control through `ElementInternals`.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the checkbox; the control part holds checked and indeterminate indicators.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            control: {
                description: "The box, with the checked and indeterminate indicators.",
            },
            label: {
                description: "The `label` slot or `label` attribute text that names the checkbox.",
            },
        },
    },
    contract: {
        include: [checkableDocumentation],
        properties: [
            {
                id: "indeterminate",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is shown as neither checked nor unchecked (`aria-checked=\"mixed\"`). Not an attribute, as for a native checkbox.",
            },
            {
                id: "required",
                kind: ContractPropertyKind.boolean,
                description: "Whether it must be checked for its form to be valid.",
            },
            {
                id: "readOnly",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is read only: it takes focus, and the user can't check or uncheck it. It isn't validated, as a read only native input isn't.",
            },
        ],
        slots: [
            {
                id: "checked-indicator",
                description: "Replaces the default checked glyph in the control part.",
            },
            {
                id: "indeterminate-indicator",
                description: "Replaces the default indeterminate glyph in the control part.",
            },
        ],
    },
});
