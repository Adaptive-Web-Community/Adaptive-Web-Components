import { css, ElementStyles } from "@microsoft/fast-element";
import { buttonAestheticStyles, buttonTemplateStyles } from "@adaptive-web/components-foundation";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`${buttonTemplateStyles}`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`${buttonAestheticStyles}`;
