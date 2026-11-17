import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link RadioGroupElement}.
 *
 * @public
 */
export const radioGroupDocumentation = defineDocumentation({
    id: "radioGroup",
    definition:
        "A **Radio Group** is a set of radios of which one is checked (`role=\"radiogroup\"`). The host is the form control for group validity and disabled state; each radio gives its value.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        parts: {
            label: {
                description:
                    "The `label` slot or `label` attribute text that names the group, hidden from assistive technology so it isn't read twice.",
            },
            positioningRegion: {
                description: "The container of the radios, laid out in the orientation.",
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
                description: "The name of the radios in the form data, given to each of them when it is set.",
            },
            {
                id: "orientation",
                kind: ContractPropertyKind.enum,
                description: "The direction in which the radios are laid out.",
                enumValues: [
                    { id: "horizontal", description: "Radios in a row." },
                    { id: "vertical", description: "Radios in a column." },
                ],
            },
            {
                id: "readOnly",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is read only: the arrow keys move focus without checking.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled, which disables its radios. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.",
            },
            {
                id: "required",
                kind: ContractPropertyKind.boolean,
                description: "Whether one of its radios must be checked for its form to be valid.",
            },
            {
                id: "value",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The value of the checked radio, or null when none is. Setting it checks the radio with that value.",
            },
        ],
        slots: [],
    },
});
