import {
    designUnit,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        align-items: center;
        user-select: none;
    }

    .label {
        cursor: pointer;
    }

    .label.label__hidden {
        display: none;
        visibility: hidden;
    }

    .switch {
        display: flex;
        cursor: pointer;
    }

    :host([aria-checked="true"]) .switch {
        justify-content: flex-end;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .switch {
        position: relative;
        width: calc(((${heightNumber} / 2)) * 2px + (${designUnit} * 2));
        height: calc(((${heightNumber} / 2)) * 1px + ${designUnit});
        padding: 4px;
    }

    .thumb {
        position: absolute;
        height: calc((${heightNumber}) * 1px - (${designUnit} * 5.5));
        width: calc((${heightNumber}) * 1px - (${designUnit} * 5.5));
        top: ${designUnit};
        background: currentcolor;
        fill: currentcolor;
        transition: all 0.2s ease-in-out;
    }
`;
