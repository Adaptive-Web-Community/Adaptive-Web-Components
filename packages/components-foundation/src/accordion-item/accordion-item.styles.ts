import { documentationToComponentAnatomy, type StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens, tokenVar } from "../styles/tokens.js";
import { accordionItemDocumentation } from "./accordion-item.documentation.js";
import { AccordionItemParts } from "./accordion-item.generated.js";
import { accordionItemWebBinding } from "./accordion-item.web.binding.js";

/**
 * The anatomy of an {@link AccordionItemElement}, which its styles are rendered for.
 *
 * @public
 */
export const AccordionItemAnatomy = documentationToComponentAnatomy(accordionItemDocumentation, accordionItemWebBinding);

/**
 * The layout of the anatomy of an accordion item's template, as CSS.
 *
 * @public
 */
export const accordionItemTemplateStyles = /* css */`
    :host {
        display: flex;
        flex-direction: column;
    }

    .heading {
        display: flex;
        position: relative;
        align-items: center;
        z-index: 2;
    }

    .button {
        border: none;
        background: none;
        text-align: left;
        flex-grow: 1;
        padding: unset;
        outline: none;
        cursor: pointer;
        font: inherit;
    }

    .button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        cursor: pointer;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    slot[name$="-icon"] * {
        display: flex;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ::slotted([slot="start"]) {
        order: -1;
    }

    .panel {
        display: flex;
    }

    .panel[hidden] {
        display: none;
    }

    :host([disabled]) .button::before {
        cursor: not-allowed;
    }
`;

/**
 * The visual styles of an accordion item, as CSS, beside its style rules.
 *
 * @public
 */
export const accordionItemAestheticStyles = /* css */`
    :host(:not([disabled])) .button:focus-visible::before {
        outline: ${tokenVar(tokens.shape.strokeThickness.focus)} solid ${tokenVar(tokens.color.focusStroke.outer)};
    }
`;

/**
 * The visual styles of an accordion item, as style rules.
 *
 * @public
 */
export const accordionItemStyleRules: StyleRules = [
    {
        treatments: [tokens.treatments.textPlain],
        properties: {
            borderFillBottom: { rest: tokens.color.neutral.stroke.subtle },
            borderStyleBottom: "solid",
            borderThicknessBottom: tokens.shape.strokeThickness.default,
        },
    },
    {
        target : {
            part: AccordionItemParts.heading,
        },
        treatments: [
            tokens.shape.treatments.control,
            tokens.density.control.treatment,
        ],
    },
    {
        target : {
            part: AccordionItemParts.button,
        },
        treatments: [tokens.color.neutral.treatments.foregroundStrongElement],
    },
    {
        target : {
            part: AccordionItemParts.icon,
        },
        treatments: [tokens.color.accent.treatments.foregroundReadableControl],
    },
    {
        target : {
            part: AccordionItemParts.panel,
        },
        treatments: [tokens.density.control.treatment],
    },
];
