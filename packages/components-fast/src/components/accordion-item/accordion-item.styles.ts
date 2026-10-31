import { css, ElementStyles } from "@microsoft/fast-element";
import { accordionItemAestheticStyles, accordionItemTemplateStyles } from "@adaptive-web/components-foundation";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`${accordionItemTemplateStyles}`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`${accordionItemAestheticStyles}`;
