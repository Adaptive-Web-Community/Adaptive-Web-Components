import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { checkableDocumentation } from "../checkable/checkable.documentation.js";

/**
 * Typed component documentation for {@link RadioElement}.
 *
 * @public
 */
export const radioDocumentation = defineDocumentation({
    id: "radio",
    definition:
        "A **Radio** is one option in a radio group (`role=\"radio\"`). The host is the radio and the form control through `ElementInternals`.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the radio; the control part holds the checked indicator.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            control: {
                description: "The circle, with the checked indicator.",
            },
            label: {
                description: "The `label` slot or `label` attribute text that names the radio.",
            },
        },
    },
    contract: {
        include: [checkableDocumentation],
        properties: [
            {
                id: "groupReadOnly",
                kind: ContractPropertyKind.boolean,
                description: "Whether its radio group is read only, which makes it read only.",
            },
            {
                id: "groupDisabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether its radio group is disabled, which disables it. The radio's own `disabled` attribute is the author's.",
            },
        ],
        slots: [
            {
                id: "checked-indicator",
                description: "Replaces the default checked glyph in the control part.",
            },
        ],
    },
});
