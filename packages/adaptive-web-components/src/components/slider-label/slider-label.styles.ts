import { designUnit, neutralStrokeSubtleRest } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
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
        margin: 2px 0;
    }

    :host([orientation="vertical"]) .content {
        margin-left: calc((${designUnit} / 2) * 2px);
    }

    .mark {
        justify-self: center;
        height: calc(${heightNumber} * 0.25 * 1px);
        width: calc((${designUnit} / 2) * 1px);
    }

    :host([orientation="vertical"]) .mark {
        transform: rotate(90deg);
        align-self: center;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    .mark {
        background: ${neutralStrokeSubtleRest};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
