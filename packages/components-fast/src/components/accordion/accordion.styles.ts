import { css, ElementStyles } from "@microsoft/fast-element";
import { accordionAestheticStyles, accordionTemplateStyles } from "@adaptive-web/components-foundation";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`${accordionTemplateStyles}`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`${accordionAestheticStyles}`;
