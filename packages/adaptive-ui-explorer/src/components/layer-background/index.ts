import { componentBaseStyles } from '@adaptive-web/components-fast';
import { attr, css, customElement, html, nullableNumberConverter } from "@microsoft/fast-element";
import { type ExplorerLibrary, properties, tokens } from "../../library.js";
import { ScopeElement } from "../../scope.js";

// The fixed layers, by their position in the ramp.
const layerFills = {
    minus4: tokens.color.layer.fill.ramp.minus4,
    minus3: tokens.color.layer.fill.ramp.minus3,
    minus2: tokens.color.layer.fill.ramp.minus2,
    minus1: tokens.color.layer.fill.ramp.minus1,
    base: tokens.color.layer.fill.ramp.base,
    plus1: tokens.color.layer.fill.ramp.plus1,
    plus2: tokens.color.layer.fill.ramp.plus2,
    plus3: tokens.color.layer.fill.ramp.plus3,
    plus4: tokens.color.layer.fill.ramp.plus4,
};

/**
 * The position of a fixed layer in the ramp of the layers.
 */
export type LayerFill = keyof typeof layerFills;

const layerBackgroundStyles = css`
    ${componentBaseStyles}

    :host {
        display: block;
        background: ${properties.color.context.var};
        color: ${properties.color.neutral.stroke.strong.var};
    }
`;

/**
 * A layer: a scope whose color context is a fixed layer, and which may set the luminance of the base layer, as for a dark mode.
 */
@customElement({
    name: "app-layer-background",
    styles: layerBackgroundStyles,
    template: html`<slot></slot>`,
})
export class LayerBackground extends ScopeElement {
    @attr({ attribute: "base-layer-luminance", converter: nullableNumberConverter })
    public baseLayerLuminance: number | null = null;
    protected baseLayerLuminanceChanged(): void {
        this.scopeChanged();
    }

    @attr
    public layer: LayerFill = "base";
    protected layerChanged(): void {
        this.scopeChanged();
    }

    protected updateScope(library: ExplorerLibrary): void {
        if (this.baseLayerLuminance !== null) {
            library.tokens.color.layer.fill.ramp.baseLuminance.set(this.baseLayerLuminance);
        }
        library.tokens.color.context.set(layerFills[this.layer] ?? layerFills.base);
    }
}
