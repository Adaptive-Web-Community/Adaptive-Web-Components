import { ContractPropertyKind, defineDocumentation } from "@adaptive-web/adaptive-ui";

/**
 * Typed documentation for {@link LabelledElement}: the contract of an element labelled by a label of its own, which a component includes.
 *
 * @remarks
 * It describes an interface, not a component, so it has no structure.
 *
 * @public
 */
export const labelledDocumentation = defineDocumentation({
    id: "labelled",
    definition:
        "An element labelled by a label of its own: a form control whose native element is labelled from outside, by a `<label>` (an `<input>`, a `<select>`, a `<textarea>`), and a group of them.",
    remarks:
        "The `label` slot is for a label that is more than text, and replaces the text of `label`. The default slot is never the label: it is the element's items (options, radios), when it has any.\n\n" +
        "An outside `<label for>` of the element names it too.\n\n" +
        "See `docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md`.",
    contract: {
        properties: [
            {
                id: "label",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The text of its label, which names it. The `label` slot replaces it.",
            },
            {
                id: "hideLabel",
                kind: ContractPropertyKind.boolean,
                description: "Whether its label is hidden. The label still names it.",
            },
        ],
        slots: [
            {
                id: "label",
                description: "Replaces the `label` attribute when the label needs more than plain text.",
            },
        ],
    },
});
