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

    .control {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    slot[name="checked-indicator"] *,
    slot[name="indeterminate-indicator"] * {
        /*opacity: 0;*/
        display: none;
        pointer-events: none;
    }

    :host([aria-checked="true"]) slot[name="checked-indicator"] *,
    :host([aria-checked="mixed"]) slot[name="indeterminate-indicator"] * {
        /*opacity: 1;*/
        display: flex;
    }

    .label {
        cursor: pointer;
    }

    .label.label__hidden {
        display: none;
        visibility: hidden;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .control {
        width: calc((${heightNumber} / 2) * 1px + ${designUnit});
        height: calc((${heightNumber} / 2) * 1px + ${designUnit});
        fill: currentcolor;
    }

    .label {
        padding-inline-start: calc((${designUnit} * 2) + 2px);
    }
`;
