import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { checkableDocumentation } from "../checkable/checkable.documentation.js";

/**
 * Typed component documentation for {@link SwitchElement}.
 *
 * @public
 */
export const switchDocumentation = defineDocumentation({
    id: "switch",
    definition:
        "A **Switch** turns something on and off. The host is the switch (`role=\"switch\"`) and the form control through `ElementInternals`.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the switch; the switch part holds the thumb or an author-provided track.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text that names the switch.",
            },
            switch: {
                description: "The track, with the thumb.",
                parts: {
                    thumb: {
                        description: "What moves along the track.",
                    },
                },
            },
        },
    },
    contract: {
        include: [checkableDocumentation],
        properties: [
            {
                id: "required",
                kind: ContractPropertyKind.boolean,
                description: "Whether it must be on for its form to be valid.",
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
                id: "switch",
                description: "Replaces the default track and thumb in the switch part.",
            },
        ],
    },
});
