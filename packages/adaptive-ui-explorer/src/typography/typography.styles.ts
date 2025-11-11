import { css } from "@microsoft/fast-element";
import { bodyFontFamily, colorContext, neutralFillSubtle, neutralStrokeStrong } from "@adaptive-web/adaptive-ui/reference";
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";
import { typeRampScale } from "./type-scale.js";

export const typographyStyles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        font-family: ${bodyFontFamily};
        color: ${neutralStrokeStrong.rest};
        background: ${colorContext};
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
    }

    p {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .sample-text {
        display: block;
        background: ${neutralFillSubtle.rest};
    }

    .values {
        font-size: 14px;
        line-height: 16px;
        font-family: monospace;
    }

    p.minus2 {
        font-size: ${typeRampScale.minus2.fontSize};
        line-height: ${typeRampScale.minus2.lineHeight};
    }

    p.minus1 {
        font-size: ${typeRampScale.minus1.fontSize};
        line-height: ${typeRampScale.minus1.lineHeight};
    }

    p.base {
        font-size: ${typeRampScale.base.fontSize};
        line-height: ${typeRampScale.base.lineHeight};
    }

    p.plus1 {
        font-size: ${typeRampScale.plus1.fontSize};
        line-height: ${typeRampScale.plus1.lineHeight};
    }

    p.plus2 {
        font-size: ${typeRampScale.plus2.fontSize};
        line-height: ${typeRampScale.plus2.lineHeight};
    }

    p.plus3 {
        font-size: ${typeRampScale.plus3.fontSize};
        line-height: ${typeRampScale.plus3.lineHeight};
    }

    p.plus4 {
        font-size: ${typeRampScale.plus4.fontSize};
        line-height: ${typeRampScale.plus4.lineHeight};
    }

    p.plus5 {
        font-size: ${typeRampScale.plus5.fontSize};
        line-height: ${typeRampScale.plus5.lineHeight};
    }

    p.plus6 {
        font-size: ${typeRampScale.plus6.fontSize};
        line-height: ${typeRampScale.plus6.lineHeight};
    }
`;
