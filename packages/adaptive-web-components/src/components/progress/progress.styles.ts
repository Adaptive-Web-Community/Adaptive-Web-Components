import { css, ElementStyles } from "@microsoft/fast-element";
import { designUnit } from "@adaptive-web/adaptive-ui/reference";

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

    .indicator {
        width: 100%;
    }

    .determinate {
        display: flex;
        height: 100%;
        width: calc(var(--percent-complete) * 1%);
    }

    .indeterminate {
        position: relative;
        display: flex;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .indeterminate .indicator {
        position: absolute;
        height: 100%;
        width: 40%;
        opacity: 0;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        height: ${designUnit};
    }

    .determinate {
        transition: all 0.2s ease-in-out;
    }

    .indeterminate .indicator {
        animation: indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes indeterminate {
        0% {
            opacity: 1;
            transform: translateX(-100%);
        }
        70% {
            opacity: 1;
            transform: translateX(300%);
        }
        70.01% {
            opacity: 0;
        }
        100% {
            opacity: 0;
            transform: translateX(300%);
        }
    }
`;
