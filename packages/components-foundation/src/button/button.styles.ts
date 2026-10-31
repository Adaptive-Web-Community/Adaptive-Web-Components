import { documentationToComponentAnatomy, type StyleRules } from "@adaptive-web/adaptive-ui";
import { visuallyHidden } from "../styles/styles.js";
import { tokens } from "../styles/tokens.js";
import { buttonDocumentation } from "./button.documentation.js";
import { buttonWebBinding } from "./button.web.binding.js";

/**
 * The anatomy of a {@link ButtonElement}, which its styles are rendered for.
 *
 * @public
 */
export const ButtonAnatomy = documentationToComponentAnatomy(buttonDocumentation, buttonWebBinding);

/**
 * The layout of the anatomy of a button's template, as CSS.
 *
 * @public
 */
export const buttonTemplateStyles = /* css */`
    :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    :host(:not(:disabled)) {
        cursor: pointer;
    }

    :host([hide-label]) .content {
        ${visuallyHidden}
    }
`;

/**
 * The visual styles of a button, as CSS, beside its style rules.
 *
 * @public
 */
export const buttonAestheticStyles = /* css */``;

/**
 * The visual styles of a button, as style rules.
 *
 * @public
 */
export const buttonStyleRules: StyleRules = [
    {
        treatments: [tokens.treatments.actionControl],
    },
];