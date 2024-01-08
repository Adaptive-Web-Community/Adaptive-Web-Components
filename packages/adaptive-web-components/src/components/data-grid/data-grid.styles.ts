import { css, ElementStyles } from "@microsoft/fast-element";
import { FASTDataGrid } from '@microsoft/fast-foundation';

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css<FASTDataGrid>/* CSS */`
    :host {
        display: grid;
        position: relative;
        grid-auto-flow: row;
        grid-template-columns: ${x => x.gridTemplateColumns};
    }

    :host([selection-mode="multi-row"]) {
        user-select: none;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css``;
