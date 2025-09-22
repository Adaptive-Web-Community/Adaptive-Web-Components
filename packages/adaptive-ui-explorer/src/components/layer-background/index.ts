import { Color } from '@adaptive-web/adaptive-ui';
import {
    colorContext,
    layerFillBaseLuminance,
    layerFillFixedBase,
    layerFillFixedMinus1,
    layerFillFixedMinus2,
    layerFillFixedMinus3,
    layerFillFixedMinus4,
    layerFillFixedPlus1,
    layerFillFixedPlus2,
    layerFillFixedPlus3,
    layerFillFixedPlus4,
    layerPalette,
    neutralStrokeStrongRest,
} from "@adaptive-web/adaptive-ui/reference";
import { componentBaseStyles } from '@adaptive-web/adaptive-web-components';
import { attr, css, customElement, ElementViewTemplate, FASTElement, html, nullableNumberConverter } from "@microsoft/fast-element";
import { DesignToken, DesignTokenChangeRecord } from "@microsoft/fast-foundation";

const layerBackgroundStyles = css`
    ${componentBaseStyles}

    :host {
        display: block;
        background: ${colorContext};
        color: ${neutralStrokeStrongRest};
    }
`;

function layerBackgroundTemplate<T extends LayerBackground>(): ElementViewTemplate<T> {
    return html<T>`
        <slot></slot>
    `;
}

@customElement({
    name: "app-layer-background",
    styles: layerBackgroundStyles,
    template: layerBackgroundTemplate(),
})
export class LayerBackground extends FASTElement {
    @attr({ attribute: "base-layer-luminance", converter: nullableNumberConverter })
    public baseLayerLuminance?: number;
    protected baseLayerLuminanceChanged(prev: number, next: number): void {
        if (next) {
            layerFillBaseLuminance.setValueFor(this, next);
            this.updateBackgroundColor();
        }
    }

    @attr({ attribute: "background-layer-recipe" })
    public backgroundLayerRecipe: string = "Base";
    protected backgroundLayerRecipeChanged(prev: string, next: string): void {
        this.updateBackgroundColor();
    }

    private updateBackgroundColor(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        if (this.backgroundLayerRecipe !== undefined) {
            let swatch: Color | null = null;
            switch (this.backgroundLayerRecipe) {
                case "-1":
                    swatch = layerFillFixedMinus1.getValueFor(this);
                    break;
                case "-2":
                    swatch = layerFillFixedMinus2.getValueFor(this);
                    break;
                case "-3":
                    swatch = layerFillFixedMinus3.getValueFor(this);
                    break;
                case "-4":
                    swatch = layerFillFixedMinus4.getValueFor(this);
                    break;
                case "Base":
                    swatch = layerFillFixedBase.getValueFor(this);
                    break;
                case "+1":
                    swatch = layerFillFixedPlus1.getValueFor(this);
                    break;
                case "+2":
                    swatch = layerFillFixedPlus2.getValueFor(this);
                    break;
                case "+3":
                    swatch = layerFillFixedPlus3.getValueFor(this);
                    break;
                case "+4":
                    swatch = layerFillFixedPlus4.getValueFor(this);
                    break;
            }

            if (swatch !== null) {
                colorContext.setValueFor(this, swatch);
            }
        }
    }

    public handleChange(token: DesignToken<any>, record: DesignTokenChangeRecord<any>): void {
        if (record.target === this && token === layerPalette) {
            this.updateBackgroundColor();
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        layerPalette.subscribe(this);

        this.updateBackgroundColor();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        layerPalette.unsubscribe(this);
    }
}
