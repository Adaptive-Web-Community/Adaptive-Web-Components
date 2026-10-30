import { InteractiveState } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        position: relative;
        display: block;
        width: 100%;
        overflow: hidden;
    }

    ::slotted(svg) {
        z-index: 2;
    }

    .pattern {
        position: absolute;
        width: 100%;
        height: auto;
        z-index: 2;
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
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .shimmer {
        background-image: linear-gradient(
            90deg,
            transparent 0%,
            ${tokenVar(tokens.color.neutral.fill.subtle, InteractiveState.hover)} 50%,
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
