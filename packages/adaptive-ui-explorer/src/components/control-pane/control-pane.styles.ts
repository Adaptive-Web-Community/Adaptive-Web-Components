import { css } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/components-fast";
import { properties } from "../../library.js";

export const controlPaneStyles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        flex: 0 1 auto;
        flex-direction: column;
        gap: 24px;
    }

    .title {
        font-size: ${properties.typography.ramp.default.fontSize.plus1.var};
        line-height: ${properties.typography.ramp.default.lineHeight.plus1.var};
    }

    .radio-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    label {
        align-items: flex-start;
        display: flex;
    }

    label span {
        margin-top: 3px;
    }

    input[type="checkbox"],
    input[type="radio"] {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }
`;
