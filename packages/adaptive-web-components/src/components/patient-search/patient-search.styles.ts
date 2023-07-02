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
    }
    .header{

    }
    .expanded-region{

    }
    .dob-input {}
    .dob-label {}
    .patient-id-picker {}
    .patient-id-label {}
    .last-name-picker {}
    .last-name-label {}
    .first-name-picker {}
    .first-name-label {}
    .middle-name-picker {}
    .middle-name-label {}

`;
