import { css } from "@microsoft/fast-element";
import { typeRampPositions } from "@adaptive-web/adaptive-ui";
import { componentBaseStyles } from "@adaptive-web/components-fast";
import { properties } from "../library.js";

const ramp = properties.typography.ramp.body;

// The size and the line height of each position of the ramp, and the line height of multiline text.
const positionStyles = typeRampPositions.map(position => `
    p.${position} {
        font-size: ${ramp.fontSize[position].var};
        line-height: ${ramp.lineHeight[position].var};
    }

    .multiline p.${position} {
        line-height: ${ramp.lineHeightMultiline[position].var};
    }
`).join("");

export const typographyStyles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        font-family: ${properties.typography.fontFamily.body.var};
        color: ${properties.color.neutral.stroke.strong.var};
        background: ${properties.color.context.var};
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
        background: ${properties.color.neutral.fill.subtle.var};
    }

    .values {
        font-size: 14px;
        line-height: 16px;
        font-family: monospace;
    }

    ${positionStyles}
`;
