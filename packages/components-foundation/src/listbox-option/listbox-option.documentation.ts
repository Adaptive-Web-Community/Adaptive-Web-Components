import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link ListboxOptionElement}.
 *
 * @public
 */
export const listboxOptionDocumentation = defineDocumentation({
    id: "listboxOption",
    definition:
        "An **Listbox Option** is one choice in a listbox, select, or picker (`role=\"option\"`), as a native `<option>`. It does not take focus; the listbox points at the active option with `aria-activedescendant`.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "Optional `start` and `end` slots flank the default label in the `content` part.",
        parts: {
            content: {
                description: "The default slot label and any inline content between optional `start` and `end` slots.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description: "The value it gives to the form when it is selected. Without it, its text, as a native option's.",
            },
            {
                id: "selected",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is selected now.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled: the keys reach it, and it can't be selected.",
            },
            {
                id: "active",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is the active option in its listbox.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "The option label.",
            },
            {
                id: "start",
                description: "Optional content before the label.",
            },
            {
                id: "end",
                description: "Optional content after the label.",
            },
        ],
    },
});
