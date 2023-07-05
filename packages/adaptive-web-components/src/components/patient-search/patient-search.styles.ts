// import {
//     elevationCardFocus,
//     elevationCardHover,
//     elevationCardRest,
//     layerFillInteractiveActive,
//     layerFillInteractiveHover,
//     layerFillInteractiveRest,
// } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto auto auto auto auto;
    }
    .header{
        grid-row: 1;
        grid-column: 1;
    }
    .dob-input {
        grid-row: 3;
        grid-column: 1;
    }
    .dob-label {
        grid-row: 2;
        grid-column: 1;
    }
    .patient-id-picker {
        grid-row: 3;
        grid-column: 2;
    }
    .patient-id-label {
        grid-row: 2;
        grid-column: 2;
    }

    .expanded-region {
        grid-row: 4;
        grid-column: 1 / 3;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto auto;
    }

    .expand-toggle {
        grid-row: 5;
        grid-column: 1;
    }

    .patient-list{
        grid-row: 6;
        grid-column: 1 / 3;
    }

    .last-name-picker {
        grid-row: 2;
        grid-column: 1;
    }
    .last-name-label {
        grid-row: 1;
        grid-column: 1;
    }
    .first-name-picker {
        grid-row: 2;
        grid-column: 2;
    }
    .first-name-label {
        grid-row: 1;
        grid-column: 2;
    }
    .middle-name-picker {
        grid-row: 2;
        grid-column: 3;
    }
    .middle-name-label {
        grid-row: 1;
        grid-column: 3;
    }

`;
