import { css } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/components-fast";
import { properties } from "../../library.js";

export const samplePageStyles = css`
    ${componentBaseStyles}
    
    :host {
        display: grid;
        grid-gap: calc(var(--gutter) * 2px);
        grid-template-columns: auto 300px;
        padding: calc(var(--gutter) * 2px);
        position: relative;
    }

    .image-container {
        background: ${properties.color.highlight.fill.subtle.var};
        width: 100%;
        height: 215px;
        display: flex;
    }

    .badge {
        align-self: flex-end;
        margin: calc(var(--gutter) * 1px);
    }

    .text-container {
        display: flex;
        flex-direction: column;
        padding: calc(var(--gutter) * 1px);
        text-align: start;
        color: ${properties.color.neutral.stroke.strong.var};
    }

    .sample-control {
        display: flex;
        align-items: center;
        gap: calc(${properties.global.designUnit.var} * 2);
        width: 100%;
        margin-block-start: 1em;
        margin-block-end: 1em;
    }

    .sample-control-icon {
        width: 21px;
        height: 21px;
        background-color: ${properties.color.accent.fill.readable.var};
        border-radius: ${properties.shape.cornerRadius.default.var};
    }

    .preview-controls {
        display: grid;
        grid-auto-rows: max-content;
        grid-gap: 20px;
    }

    .control-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }

    .control-container-2 {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px;
    }

    .control-container-grid {
        display: grid;
        grid-template-columns: auto 1fr;
    }

    .checkbox {
        grid-row: 2;
    }

    adaptive-card {
        width: 280px;
    }
`;
