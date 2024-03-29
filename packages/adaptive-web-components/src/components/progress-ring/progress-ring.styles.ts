import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        position: relative;
        display: flex;
        align-items: center;
        contain: content;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        height: calc(${heightNumber} * 1px);
        width: calc(${heightNumber} * 1px);
    }

    .progress {
        display: block;
        height: 100%;
        width: 100%;
    }

    .background {
        stroke: currentcolor;
        fill: none;
        stroke-width: 2px;
    }

    .indicator {
        stroke: currentcolor;
        fill: none !important;
        stroke-width: 2px;
        stroke-linecap: round;
        transform-origin: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.2s ease-in-out;
    }

    .determinate .indicator {
        --progress-segments: 44;
        stroke-dasharray: calc(((var(--progress-segments) * var(--percent-complete)) / 100) * 1px)
            calc(var(--progress-segments) * 1px);
    }

    .indeterminate .indicator {
        animation: spin-infinite 2s linear infinite;
    }

    @keyframes spin-infinite {
        0% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(0deg);
        }
        50% {
            stroke-dasharray: 21.99px 21.99px;
            transform: rotate(450deg);
        }
        100% {
            stroke-dasharray: 0.01px 43.97px;
            transform: rotate(1080deg);
        }
    }
`;
