import {
    cornerRadiusControl,
    focusStrokeThickness,
    highlightStrokeReadable,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        width: max-content;
    }

    :host([orientation="vertical"]) {
        flex-direction: column;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    ::slotted([selected])::after {
        content: "";
        display: block;
        position: absolute;
        border-radius: ${cornerRadiusControl};
        background: ${highlightStrokeReadable.rest};
    }

    :host([orientation="horizontal"]) ::slotted([selected])::after {
        bottom: ${focusStrokeThickness};
        width: 20px;
        height: 3px;
    }

    :host([orientation="vertical"]) ::slotted([selected])::after {
        left: ${focusStrokeThickness};
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
    }
`;
