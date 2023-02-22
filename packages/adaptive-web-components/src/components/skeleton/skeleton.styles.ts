import { controlCornerRadius, neutralFillSecondaryHover, neutralFillSecondaryRest } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        position: relative;
        display: block;
        width: 100%;
        overflow: hidden;
    }

    :host([shape="circle"]) {
        border-radius: 100%;
    }

    object {
        position: absolute;
        width: 100%;
        height: auto;
        z-index: 2;
    }

    object img {
        width: 100%;
        height: auto;
    }

    ::slotted(svg) {
        z-index: 2;
    }

    .pattern {
        width: 100%;
        height: 100%;
    }

    .shimmer {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host([shape="rect"]) {
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    :host {
        background-color: ${neutralFillSecondaryRest};
    }

    .shimmer {
        background-image: linear-gradient(
            90deg,
            transparent 0%,
            ${neutralFillSecondaryHover} 50%,
            transparent 100%
        );
        background-size: 0px 0px / 90% 100%;
        background-repeat: no-repeat;
        animation: shimmer 2s infinite;
        animation-timing-function: ease-in-out;
        animation-direction: normal;
        
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
`;
