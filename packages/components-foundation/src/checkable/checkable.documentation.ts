import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link CheckableElement}: the contract that a checkbox, a switch, and a radio share, which each of them
 * includes (see `Contract.include`).
 *
 * @remarks
 * It describes an interface, not a component: the host is the control (`docs/decisions/0010-a-control-is-its-host-element.md`), so each
 * component that includes it documents its own parts.
 *
 * @public
 */
export const checkableDocumentation = defineDocumentation({
    id: "checkable",
    definition:
        "A control that is checked or not, as a native checkbox or radio is: a checkbox, a switch, or a radio. The host is the form control through `ElementInternals`.",
    remarks:
        "When it is checked, its form data is its `name` with its `value`.\n\n" +
        "Custom states: `checked`, `readonly` when it is read only, `disabled` when its group disables it, and `active` while Space is held.\n\n" +
        "Events: `input` and then `change`, both bubbling, when the user checks or unchecks it.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    contract: {
        include: [labelledDocumentation],
        properties: [
            {
                id: "checked",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is checked now. Not an attribute: the `checked` attribute is whether it is checked by default, before the user or code checks or unchecks it and when its form is reset.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled. A disabled `<fieldset>` also disables it, which this doesn't reflect: select `:disabled`.",
            },
            {
                id: "name",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The name of its value in the form data.",
            },
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description: 'Its value in the form data when it is checked. The default is `on`, as a native checkbox\'s is.',
            },
        ],
        slots: [],
    },
});
