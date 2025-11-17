import {
    Color,
    Palette,
} from "@adaptive-web/adaptive-ui";
import {
    accentBaseColor,
    accentPalette,
    highlightBaseColor,
    highlightPalette,
    LayerBaseLuminance,
    layerFillBaseLuminance,
    layerFillFixedBase,
    layerFillFixedMinus1,
    layerFillFixedMinus2,
    layerFillFixedMinus3,
    layerFillFixedPlus1,
    neutralBaseColor,
    neutralPalette,
    wcagContrastLevel
} from "@adaptive-web/adaptive-ui/reference";
import {
    css,
    customElement,
    FASTElement,
    html,
    Notifier,
    Observable,
    observable,
    ref,
    repeat,
    Subscriber,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";
import { ComponentType } from "./component-type.js";
import { ColorBlock } from "./components/color-block.js";
import { ControlPane } from "./components/control-pane/index.js";
import { LayerBackground } from "./components/layer-background/index.js";
import { PaletteGradient } from "./components/palette-gradient/palette-gradient.js";
import { SampleApp } from "./sample/index.js";
import { typeRampScale, Typography } from "./typography/index.js";
import { State } from "./state.js";

ColorBlock;
ControlPane;
LayerBackground;
PaletteGradient;
SampleApp;
Typography;

const colorBlockTemplate = html<App>`
    ${repeat(
        (x) => x.backgrounds,
        html<SwatchInfo, App>`
            <app-color-block
                id=${(x) => x.color.toUpperCase().replace("#", "")}
                index=${(x) => x.index}
                component=${(_, c) => c.parent.state.componentType}
                color=${(x) => x.color}
                layer-name=${(x) => x.title}
                :disabledState=${(_, c) => c.parent.state.disabledState}
                :showSwatches=${(_, c) => c.parent.state.showSwatches}
            ></app-color-block>
        `
    )}
`;

const sampleTemplate = html<App>`
    <app-design-system-provider style="display: flex;">
        <app-layer-background
            id="light-mode"
            base-layer-luminance="${LayerBaseLuminance.LightMode}"
            background-layer-recipe="-3"
            style="flex-grow: 1; padding: 100px;"
        >
            <app-sample-app></app-sample-app>
        </app-layer-background>
        <app-layer-background
            id="dark-mode"
            base-layer-luminance="${LayerBaseLuminance.DarkMode}"
            background-layer-recipe="-3"
            style="flex-grow: 1; padding: 100px;"
        >
            <app-sample-app></app-sample-app>
        </app-layer-background>
    </app-design-system-provider>
`;

const typographyTemplate = html<App>`
    <app-design-system-provider>
        <app-typography></app-typography>
    </app-design-system-provider>
`;

const template = html<App>`
    <div class="container fill">
        <div class="row fill">
            <app-design-system-provider class="canvas" ${ref("canvas")}>
                <app-design-system-provider ${ref("designSystemElement")}></app-design-system-provider>
                <div class="container fill">
                    <div class="row gradient">
                        <app-palette-gradient :palette=${(x) => x.neutralPalette}></app-palette-gradient>
                    </div>
                    <div class="row gradient">
                        <app-palette-gradient :palette=${(x) => x.accentPalette}></app-palette-gradient>
                    </div>
                    <div class="row gradient">
                        <app-palette-gradient :palette=${(x) => x.highlightPalette}></app-palette-gradient>
                    </div>
                    <div class="row fill">
                        <div style="display: flex; overflow: auto;">${(x) => x.componentTypeTemplate()}</div>
                    </div>
                </div>
            </app-design-system-provider>
            <div>
                <app-layer-background
                    class="control-pane-container"
                    base-layer-luminance=${LayerBaseLuminance.DarkMode}
                >
                    <app-control-pane></app-control-pane>
                </app-layer-background>
            </div>
        </div>
    </div>
`;

const styles = css`
    :host {
        width: 100%;
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    .container.fill {
        width: 100%;
        height: 100%;
    }

    .row {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-basis: auto;
    }

    .row.fill {
        flex: 1;
        overflow: hidden;
    }

    .canvas {
        min-width: 300px;
        flex-grow: 1;
    }

    app-palette-gradient {
        height: 20px;
        flex: 1;
    }

    .control-pane-container {
        height: 100%;
        z-index: 1;
        padding: 40px;
        position: relative;
        overflow-y: auto;
        width: 320px;
    }

    app-color-block {
        min-width: 400px;
    }
`;

export interface SwatchInfo {
    index: number;
    color: string;
    title?: string;
}

@customElement({
    name: `app-design-system-provider`,
    styles: componentBaseStyles,
    template: html`
        <slot></slot>
    `,
})
class DesignSystemProvider extends FASTElement {}
DesignSystemProvider;

export class App extends FASTElement {
    public canvas?: DesignSystemProvider;

    @State state!: State;

    @observable
    public neutralPalette?: Palette;

    @observable
    public neutralColors: string[] = [];

    @observable
    public accentPalette?: Palette;

    @observable
    public highlightPalette?: Palette;

    @observable
    public backgrounds: SwatchInfo[] = [];

    private _stateNotifier: Notifier | null = null;
    private _stateHandler: Subscriber | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const app = this;
        this._stateNotifier = Observable.getNotifier(this.state);
        this._stateHandler = {
            handleChange(source: State, propertyName: keyof State) {
                if (app.$fastController.isConnected && app.canvas) {
                    switch (propertyName) {
                        case "neutralColor":
                            neutralBaseColor.setValueFor(app.canvas, source.neutralColor);

                            app.neutralPalette = neutralPalette.getValueFor(app.canvas);
                            app.neutralColors = app.neutralPalette.swatches.map((x) => x.toColorString());

                            app.updateBackgrounds();
                            break;
                        case "accentColor":
                            accentBaseColor.setValueFor(app.canvas, source.accentColor);

                            app.accentPalette = accentPalette.getValueFor(app.canvas);
                            break;
                        case "highlightColor":
                            highlightBaseColor.setValueFor(app.canvas, source.highlightColor);

                            app.highlightPalette = highlightPalette.getValueFor(app.canvas);
                            break;
                        case "showOnlyLayerBackgrounds":
                            app.updateBackgrounds();
                            break;
                        case "wcagContrastLevel":
                            wcagContrastLevel.setValueFor(app.canvas, source.wcagContrastLevel);
                            break;
                        case "typeScaleBaseSize":
                            typeRampScale.base.fontSize.setValueFor(app.canvas, `${source.typeScaleBaseSize}px`);
                            break;
                        case "typeScaleMultiplier":
                            typeRampScale.multiplier.setValueFor(app.canvas, source.typeScaleMultiplier);
                            break;
                        case "typeScaleLineHeightRatio":
                            typeRampScale.lineHeightRatio.setValueFor(app.canvas, source.typeScaleLineHeightRatio);
                            break;
                        case "typeScaleLineHeightMultilineRatio":
                            typeRampScale.lineHeightMultilineRatio.setValueFor(app.canvas, source.typeScaleLineHeightMultilineRatio);
                            break;
                        case "typeScaleLineHeightSnap":
                            typeRampScale.lineHeightSnap.setValueFor(app.canvas, `${source.typeScaleLineHeightSnap}px`);
                            break;
                        default:
                            break;
                    }
                }
            },
        };
        this._stateNotifier.subscribe(this._stateHandler);

        this.state.neutralColor = neutralBaseColor.getValueFor(this);
        this.state.accentColor = accentBaseColor.getValueFor(this);
        this.state.highlightColor = highlightBaseColor.getValueFor(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this._stateHandler) {
            this._stateNotifier?.unsubscribe(this._stateHandler);
        }
    }

    public designSystemElement?: FASTElement;

    public componentTypeTemplate(): ViewTemplate<App, any> {
        if (this.state.componentType === ComponentType.sample) {
            return sampleTemplate;
        } else if (this.state.componentType === ComponentType.typography) {
            return typographyTemplate;
        } else {
            return colorBlockTemplate;
        }
    }

    private updateBackgrounds(): void {
        const layers: SwatchInfo[] = this.lightModeLayers.concat(this.darkModeLayers);

        this.backgrounds = this.state.showOnlyLayerBackgrounds
            ? layers
            : this.neutralColors.map((color: string, index: number): SwatchInfo => {
                  const neutralLayerIndex: number = layers.findIndex(
                      (config: SwatchInfo): boolean => config.color === color
                  );

                  return {
                      index,
                      color,
                      title: neutralLayerIndex !== -1 ? layers[neutralLayerIndex].title : undefined,
                  };
              });
    }

    private layerTokens: Array<[DesignToken<Color>, string]> = [
        [layerFillFixedPlus1, "+1"],
        [layerFillFixedBase, "Base"],
        [layerFillFixedMinus1, "-1"],
        [layerFillFixedMinus2, "-2"],
        [layerFillFixedMinus3, "-3"],
    ];

    private resolveLayerRecipes = (luminance: number): SwatchInfo[] => {
        const ds = this.designSystemElement;
        if (ds) {
            layerFillBaseLuminance.setValueFor(ds, luminance);

            return this.layerTokens
                .map((conf: [DesignToken<Color>, string]): SwatchInfo => {
                    const color = conf[0].getValueFor(ds).toColorString();
                    return {
                        index: this.neutralColors.indexOf(color),
                        color: color,
                        title: conf[1],
                    };
                })
                .reduce((accumulated: SwatchInfo[], value: SwatchInfo): Array<SwatchInfo> => {
                    const colorIndex: number = accumulated.findIndex(
                        (config: SwatchInfo): boolean => config.color === value.color
                    );

                    return colorIndex === -1
                        ? accumulated.concat(value)
                        : accumulated.map(
                            (config: SwatchInfo, index: number): SwatchInfo =>
                                index === colorIndex
                                    ? {
                                            index: this.neutralColors.indexOf(value.color),
                                            color: value.color,
                                            title: value.title!.concat(", ", config.title!),
                                        }
                                    : config
                        );
                }, [])
                .sort((a: SwatchInfo, b: SwatchInfo): number => a.index - b.index);
        } else {
            return [];
        }
    };

    private get lightModeLayers(): SwatchInfo[] {
        return this.resolveLayerRecipes(LayerBaseLuminance.LightMode);
    }

    private get darkModeLayers(): SwatchInfo[] {
        return this.resolveLayerRecipes(LayerBaseLuminance.DarkMode);
    }
}

export const app = App.compose({
    name: "app-main",
    template,
    styles,
});
