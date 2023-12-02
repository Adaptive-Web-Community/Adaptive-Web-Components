import { css } from "@microsoft/fast-element";
import {
    bodyFontFamily,
    cornerRadiusLayer,
    elevationCardRest,
    fillColor,
    layerFillInteractiveRest,
    neutralStrokeStrongRest,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight
} from "@adaptive-web/adaptive-ui/reference";
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";

export const sampleAppStyles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        font-family: ${bodyFontFamily};
        color: ${neutralStrokeStrongRest};
        min-height: 650px;
        min-width: 775px;
        background: ${fillColor};
        border-radius: ${cornerRadiusLayer};
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

    adaptive-tabs {
        flex-grow: 1;
    }

    adaptive-tabs::part(tablist) {
        padding: 0 8px;
        width: auto;
        align-self: start;
    }

    adaptive-tabs::part(tabpanel) {
        display: flex;
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
        border-start-start-radius: ${cornerRadiusLayer};
        border-end-end-radius: ${cornerRadiusLayer};
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

    adaptive-card:hover {
        background: ${layerFillInteractiveRest};
        box-shadow: ${elevationCardRest};
    }

    .content .heading {
        font-size: ${typeRampPlus3FontSize};
        line-height: ${typeRampPlus3LineHeight};
        margin: 0;
        margin-bottom: 10px;
        font-weight: bold;
    }
`;
