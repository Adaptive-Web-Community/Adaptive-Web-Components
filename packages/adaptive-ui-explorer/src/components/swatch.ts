import { componentBaseStyles } from "@adaptive-web/components-fast";
import {
    css,
    customElement,
    type ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { properties } from "../library.js";

export enum SwatchType {
    fill = "fill",
    foreground = "foreground",
    outline = "outline",
}

/**
 * A color of a treatment in a state, as CSS, with what it is drawn on.
 */
export interface SwatchInfo {
    type: SwatchType;
    name: string;
    fill: string;
    foreground?: string;
    outline?: string;
    value: string;
    contrast: string;
}

function iconStyle(swatch: SwatchInfo): string {
    const background = `background: ${swatch.fill}`;
    switch (swatch.type) {
        case SwatchType.outline:
            return `border: 4px solid ${swatch.outline}; ${background}`;
        case SwatchType.foreground:
            return `color: ${swatch.foreground}; ${background}`;
        default:
            return background;
    }
}

function template<T extends AppSwatch>(): ElementViewTemplate<T> {
    return html<T>`
        <div
            class="icon ${x => x.swatch?.type}"
            style="${x => x.swatch ? iconStyle(x.swatch) : ""}"
            title="${x => x.swatch?.contrast}"
        ></div>
        <code class="recipe-name" title="${x => x.swatch?.name}">${x => x.swatch?.name}</code>
        <code class="hex-code">${x => x.swatch?.value.toUpperCase()}</code>
    `;
}

const styles = css`
    ${componentBaseStyles}

    :host {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        justify-items: start;
        grid-column-gap: ${properties.density.control.horizontal.gap.var};
        color: ${properties.color.neutral.stroke.readable.var};
        font-size: ${properties.typography.ramp.default.fontSize.minus1.var};
    }

    .icon.foreground::before {
        font-size: 13px;
        content: "A";
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 2px;
        box-sizing: border-box;
    }

    .recipe-name {
        grid-column: 2;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        text-align: start;
    }

    .hex-code {
        grid-column: 3;
    }
`;

/**
 * A swatch of a color of a treatment, its name, its value, and its contrast.
 */
@customElement({
    name: "app-swatch",
    template: template(),
    styles,
})
export class AppSwatch extends FASTElement {
    @observable
    public swatch?: SwatchInfo;
}
