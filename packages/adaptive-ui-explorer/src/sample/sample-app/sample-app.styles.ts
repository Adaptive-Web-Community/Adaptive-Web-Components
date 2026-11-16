import { css } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/components-fast";
import { properties } from "../../library.js";

export const sampleAppStyles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        font-family: ${properties.typography.fontFamily.body.var};
        color: ${properties.color.neutral.stroke.strong.var};
        min-height: 650px;
        min-width: 775px;
        background: ${properties.color.context.var};
        border-radius: ${properties.shape.cornerRadius.layer.var};
        --gutter: 20;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        border-radius: inherit;
    }

    p {
        margin: 0;
    }

    .toolbar {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 12px;
    }

    .tabs {
        display: flex;
        flex-grow: 1;
    }

    adaptive-tablist {
        padding: 0 8px;
        align-self: start;
    }

    .panels {
        display: flex;
        flex-grow: 1;
    }

    adaptive-tab {
        position: relative;
    }

    adaptive-tab-panel {
        display: flex;
        flex-grow: 1;
        padding: 0;
    }

    .content {
        display: flex;
        flex-grow: 1;
        gap: 8px;
        padding: 8px;
        border-start-start-radius: ${properties.shape.cornerRadius.layer.var};
        border-end-end-radius: ${properties.shape.cornerRadius.layer.var};
    }

    .pane {
        width: 240px;
        display: flex;
        flex-direction: column;
    }

    .details {
        flex-grow: 1;
        height: unset;
        width: unset;
    }

    .content .heading {
        font-size: ${properties.typography.ramp.default.fontSize.plus3.var};
        line-height: ${properties.typography.ramp.default.lineHeight.plus3.var};
        margin: 0;
        margin-bottom: 10px;
        font-weight: bold;
    }
`;
