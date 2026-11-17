import {
    ContractPropertyKind,
    defineDocumentation,
    DocStatus,
    RuleSeverity,
    RuleStance,
} from "@adaptive-web/adaptive-ui";
import { contentLabelledDocumentation } from "../utilities/content-labelled.documentation.js";

/**
 * Typed component documentation for {@link ButtonElement}.
 *
 * @public
 */
export const buttonDocumentation = defineDocumentation({
    id: "button",
    definition:
        "A **Button** triggers an action or submits a form. The host element is the control: it receives focus, participates in forms, and exposes a default slot for its label.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-12",
    },
    disambiguation: [
        {
            id: "anchor",
            use: "Use when navigation to a URL is the primary outcome, not an in-place action.",
        },
        {
            id: "menuItem",
            use: "Use for choices inside a Menu, not for standalone page actions.",
        },
    ],
    structure: {
        description: "The host element is the control: it takes focus, shows the focus indicator, and handles activation.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            content: {
                description: "The default slot label and any inline content between optional `start` and `end` slots.",
            },
        },
    },
    contract: {
        include: [contentLabelledDocumentation],
        properties: [
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description: "When set, the button cannot be activated and is removed from the tab order.",
            },
            {
                id: "type",
                kind: ContractPropertyKind.enum,
                description: "Form participation: submit, reset, or plain button.",
                enumValues: [
                    { id: "button", description: "No default form action." },
                    { id: "submit", description: "Submits the associated form." },
                    { id: "reset", description: "Resets the associated form." },
                ],
            },
        ],
        slots: [
            {
                id: "start",
                description: "Optional content before the label, commonly an icon.",
            },
            {
                id: "end",
                description: "Optional content after the label, commonly an icon.",
            },
        ],
    },
    accessibility: {
        summary:
            "The host is a native `button` with the `button` role. Keyboard activation uses **Space** and **Enter** like a platform button.",
        responsibilities: [
            "Provide an accessible name when `hide-label` hides the visible label (default slot text or `aria-label` / `aria-labelledby`).",
            "Do not rely on color alone to convey meaning.",
        ],
    },
    capabilities: {
        summary: "Built-in form association, disabled state, and invoker command behavior without product handlers.",
        items: [
            {
                id: "formAssociated",
                description: "Participates in form data and validation through `ElementInternals` when implemented by the host.",
            },
            {
                id: "disabled",
                description: "Reflects the `disabled` attribute and ancestor `fieldset[disabled]` behavior expected of buttons.",
            },
        ],
    },
    usage: {
        rules: [
            {
                id: "onePrimaryPerView",
                stance: RuleStance.do,
                severity: RuleSeverity.must,
                categories: ["hierarchy"],
                text: "Limit **primary** actions to one obvious choice per view or task.",
            },
            {
                id: "hideLabelAccessibleName",
                stance: RuleStance.do,
                severity: RuleSeverity.must,
                categories: ["a11y-responsibility", "content"],
                text: "When `hideLabel` is set, keep label text in the default slot (visually hidden but still naming the control) or set `aria-label` / `aria-labelledby`.",
            },
            {
                id: "noVagueCritical",
                stance: RuleStance.dont,
                severity: RuleSeverity.must,
                categories: ["content"],
                text: "Do not use vague labels (for example “OK”) on **critical** or destructive actions.",
            },
            {
                id: "noNestedInteractive",
                stance: RuleStance.dont,
                severity: RuleSeverity.must,
                categories: ["content"],
                text: "Do not place interactive elements inside the button slots.",
            },
        ],
    },
});
