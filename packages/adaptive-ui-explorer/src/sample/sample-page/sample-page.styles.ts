import { css } from "@microsoft/fast-element";
import { accentFillReadableRest, cornerRadiusControl, designUnit, highlightFillSubtleRest, neutralStrokeStrongRest } from "@adaptive-web/adaptive-ui/reference";
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";

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
        background: ${highlightFillSubtleRest};
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
        color: ${neutralStrokeStrongRest};
    }

    .sample-control {
        display: flex;
        align-items: center;
        gap: calc(${designUnit} * 2);
        width: 100%;
        margin-block-start: 1em;
        margin-block-end: 1em;
    }

    .sample-control-icon {
        width: 21px;
        height: 21px;
        background-color: ${accentFillReadableRest};
        border-radius: ${cornerRadiusControl};
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
        grid-template-columns: 1fr auto auto;
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
