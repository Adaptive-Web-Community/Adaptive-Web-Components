import { ContractPropertyKind, defineDocumentation } from "@adaptive-web/adaptive-ui";

/**
 * Typed documentation for {@link ContentLabelledElement}: the contract of an element labelled by its content, which a component includes.
 *
 * @remarks
 * It describes an interface, not a component, so it has no structure.
 *
 * @public
 */
export const contentLabelledDocumentation = defineDocumentation({
    id: "contentLabelled",
    definition:
        "An element labelled by its content: one whose native element is named by its content (a `<button>`, an `<a>`).",
    remarks:
        "Its label is the content of its default slot, so it has no `label` attribute and no `label` slot.\n\n" +
        "See `docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md`.",
    contract: {
        properties: [
            {
                id: "hideLabel",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether its label, the content of its default slot, is hidden, as for a control that shows only an icon. The label still names it.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "The content of the element, which is its label and names it.",
            },
        ],
    },
});
