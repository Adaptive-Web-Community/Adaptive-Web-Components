import { css } from "@microsoft/fast-element";
import { typeRampDefault } from "@adaptive-web/adaptive-ui/reference";
import { componentBaseStyles } from "@adaptive-web/components-fast";

export const controlPaneStyles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        flex: 0 1 auto;
        flex-direction: column;
        gap: 24px;
    }

    .title {
        font-size: ${typeRampDefault.plus1.fontSize};
        line-height: ${typeRampDefault.plus1.lineHeight};
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
