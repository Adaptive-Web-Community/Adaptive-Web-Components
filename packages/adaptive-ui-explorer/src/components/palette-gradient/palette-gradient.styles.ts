import { css } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";

export const paletteGradientStyles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
    }

    a {
        display: flex;
        flex: 1;
    }

    a.source {
        position: relative;
    }

    a.source::before {
        width: 6px;
        height: 6px;
        margin: 0 auto;
        content: "";
        opacity: 0.7;
        position: relative;
        border: solid 1px currentcolor;
        border-radius: 50%;
        display: block;
        align-self: center;
    }

    a.closest::before {
        content: "~";
        border: none;
        line-height: 6px;
    }
`;
