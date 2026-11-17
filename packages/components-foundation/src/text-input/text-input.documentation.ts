import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link TextInputElement}: the contract that a text field, a text area, a number field, and a search
 * share, which each of them includes (see `Contract.include`).
 *
 * @remarks
 * It describes an interface, not a component: it has no structure (the control is an `<input>` in one and a `<textarea>` in another), so
 * each component that includes it documents its own parts.
 *
 * @public
 */
export const textInputDocumentation = defineDocumentation({
    id: "textInput",
    definition:
        "A field the user types text in: a text field, a text area, a number field, or a search field. It wraps a native `<input>` or `<textarea>` (the control), since what the browser does for one (selection, input methods, spelling, autofill) can't be done for a custom element. The host is the form control, through `ElementInternals`, with the control's value and validity.",
    remarks:
        "Its label (see the `labelled` contract) names the control, as an outside `<label for>` does too.\n\n" +
        "Events: `input` (the control's, which leaves the shadow root) and `change` (dispatched from the host, since the control's doesn't).",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-16",
    },
    contract: {
        include: [labelledDocumentation],
        properties: [
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description:
                    "The value now. Not an attribute: the `value` attribute is the value by default, before the user or code changes it and when its form is reset.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled. A disabled `<fieldset>` also disables it, which this doesn't reflect: select `:disabled`.",
            },
            {
                id: "readOnly",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is read only: it takes focus and its text can be selected, and the user can't change it. It isn't validated.",
            },
            {
                id: "required",
                kind: ContractPropertyKind.boolean,
                description: "Whether it must have a value for its form to be valid.",
            },
            {
                id: "name",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The name of its value in the form data.",
            },
            {
                id: "placeholder",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "A hint of what to type, shown while it is empty. It isn't a label.",
            },
            {
                id: "maxLength",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The most characters the user can type.",
            },
            {
                id: "minLength",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The fewest characters of a valid value.",
            },
            {
                id: "autocomplete",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "What the browser can fill it with (`email`, `current-password`, ...).",
            },
        ],
        slots: [],
    },
});
