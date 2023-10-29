import { css, ElementStyles } from "@microsoft/fast-element";
import {
    focusStrokeOuter,
    focusStrokeThickness,
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        flex-direction: column;
    }

    .heading {
        display: flex;
        position: relative;
        align-items: center;
        z-index: 2;
    }

    .button {
        appearance: none;
        border: none;
        background: none;
        text-align: left;
        flex-grow: 1;
        padding: unset;
        outline: none;
        cursor: pointer;
        font: inherit;
    }

    .button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        cursor: pointer;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    slot[name="collapsed-icon"] * {
        display: flex;
    }

    :host([expanded]) slot[name="collapsed-icon"] * {
        display: none;
    }

    slot[name="expanded-icon"] * {
        display: none;
    }

    :host([expanded]) slot[name="expanded-icon"] * {
        display: flex;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ::slotted([slot="start"]) {
        order: -1;
    }

    .region {
        display: none;
    }

    :host([expanded]) .region {
        display: flex;
    }

    :host([disabled]) .button::before {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host(:not([disabled])) .button:focus-visible::before {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    }
`;
