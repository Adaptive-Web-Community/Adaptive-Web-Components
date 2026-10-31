import { documentationToComponentAnatomy, type StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../styles/tokens.js";
import { accordionDocumentation } from "./accordion.documentation.js";
import { accordionWebBinding } from "./accordion.web.binding.js";

/**
 * The anatomy of an {@link AccordionElement}, which its styles are rendered for.
 *
 * @public
 */
export const AccordionAnatomy = documentationToComponentAnatomy(accordionDocumentation, accordionWebBinding);

/**
 * The layout of the anatomy of an accordion's template, as CSS.
 *
 * @public
 */
export const accordionTemplateStyles = /* css */`
    :host {
        display: flex;
        flex-direction: column;
    }
`;

/**
 * The visual styles of an accordion, as CSS, beside its style rules.
 *
 * @public
 */
export const accordionAestheticStyles = /* css */``;

/**
 * The visual styles of an accordion, as style rules.
 *
 * @public
 */
export const accordionStyleRules: StyleRules = [
    {
        treatments: [tokens.treatments.textPlain],
        properties: {
            borderFillTop: { rest: tokens.color.neutral.stroke.subtle },
            borderStyleTop: "solid",
            borderThicknessTop: tokens.shape.strokeThickness.default,
        },
    },
];