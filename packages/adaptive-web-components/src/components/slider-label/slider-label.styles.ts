import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host([orientation="horizontal"]) {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
    }

    :host([orientation="vertical"]) {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
    }

    .container {
        position: absolute;
        display: grid;
        justify-self: center;
    }

    :host([orientation="horizontal"]) .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }

    :host([orientation="vertical"]) .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }

    .content {
        justify-self: center;
        align-self: center;
        white-space: nowrap;
        max-width: 30px;
        margin-top: 4px;
    }

    :host([orientation="vertical"]) .content {
        margin-left: 4px;
    }

    .mark {
        justify-self: center;
    }

    :host([orientation="vertical"]) .mark {
        transform: rotate(90deg);
        align-self: center;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
