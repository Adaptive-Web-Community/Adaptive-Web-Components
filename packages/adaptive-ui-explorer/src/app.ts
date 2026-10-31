import { formatColor, type Palette } from "@adaptive-web/adaptive-ui";
import { LayerBaseLuminance } from "@adaptive-web/adaptive-ui/reference";
import {
    css,
    FASTElement,
    html,
    type Notifier,
    Observable,
    observable,
    ref,
    repeat,
    type Subscriber,
    type ViewTemplate,
} from "@microsoft/fast-element";
import { px } from "design-token-library";
import { ComponentType } from "./component-type.js";
import { ColorBlock } from "./components/color-block.js";
import { ControlPane } from "./components/control-pane/index.js";
import { LayerBackground } from "./components/layer-background/index.js";
import { PaletteGradient } from "./components/palette-gradient/palette-gradient.js";
import type { ExplorerLibrary } from "./library.js";
import { SampleApp } from "./sample/index.js";
import { Scope } from "./scope.js";
import { Typography } from "./typography/index.js";
import { State } from "./state.js";

ColorBlock;
ControlPane;
LayerBackground;
PaletteGradient;
SampleApp;
Scope;
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
    <div style="display: flex;">
        <app-layer-background
            id="light-mode"
            base-layer-luminance="${LayerBaseLuminance.LightMode}"
            layer="minus3"
            style="flex-grow: 1; padding: 100px;"
        >
            <app-sample-app></app-sample-app>
        </app-layer-background>
        <app-layer-background
            id="dark-mode"
            base-layer-luminance="${LayerBaseLuminance.DarkMode}"
            layer="minus3"
            style="flex-grow: 1; padding: 100px;"
        >
            <app-sample-app></app-sample-app>
        </app-layer-background>
    </div>
`;

const typographyTemplate = html<App>`
    <app-typography></app-typography>
`;

export const template = html<App>`
    <div class="container fill">
        <div class="row fill">
            <app-scope class="canvas" ${ref("canvas")}>
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
            </app-scope>
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

export const styles = css`
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

// The fixed layers that are shown, with their titles.
const layerFills = [
    ["plus1", "+1"],
    ["base", "Base"],
    ["minus1", "-1"],
    ["minus2", "-2"],
    ["minus3", "-3"],
] as const;

export class App extends FASTElement {
    public canvas?: Scope;

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

    // The canvas in light mode and in dark mode, whose layers are the backgrounds. They follow the canvas.
    private layerProbes: ExplorerLibrary[] = [];

    private _stateNotifier: Notifier | null = null;
    private _stateHandler: Subscriber | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        const canvas = this.canvas?.library;
        if (!canvas) {
            return;
        }

        this.layerProbes = [LayerBaseLuminance.LightMode, LayerBaseLuminance.DarkMode].map(baseLuminance =>
            canvas.extend({ color: { layer: { fill: { ramp: { baseLuminance: { $value: baseLuminance } } } } } })
        );

        this._stateNotifier = Observable.getNotifier(this.state);
        this._stateHandler = {
            handleChange: (source: State, propertyName: keyof State) => this.stateChanged(canvas, source, propertyName),
        };
        this._stateNotifier.subscribe(this._stateHandler);

        this.updatePalettes(canvas);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this._stateHandler) {
            this._stateNotifier?.unsubscribe(this._stateHandler);
        }
    }

    public componentTypeTemplate(): ViewTemplate<App, any> {
        if (this.state.componentType === ComponentType.sample) {
            return sampleTemplate;
        } else if (this.state.componentType === ComponentType.typography) {
            return typographyTemplate;
        } else {
            return colorBlockTemplate;
        }
    }

    // Sets a value of the state on the library of the canvas.
    private stateChanged(canvas: ExplorerLibrary, state: State, propertyName: keyof State): void {
        const { color, typography } = canvas.tokens;
        const scale = typography.ramp.body;
        switch (propertyName) {
            case "neutralColor":
                color.neutral.base.set(state.neutralColor);
                this.updatePalettes(canvas);
                break;
            case "accentColor":
                color.accent.base.set(state.accentColor);
                this.updatePalettes(canvas);
                break;
            case "highlightColor":
                color.highlight.base.set(state.highlightColor);
                this.updatePalettes(canvas);
                break;
            case "neutralAsOverlay":
                color.neutral.asOverlay.set(state.neutralAsOverlay);
                break;
            case "showOnlyLayerBackgrounds":
                this.updateBackgrounds();
                break;
            case "wcagContrastLevel":
                color.wcagContrast.level.set(state.wcagContrastLevel);
                break;
            case "typeScaleBaseSize":
                scale.fontSize.base.set(px(state.typeScaleBaseSize));
                break;
            case "typeScaleMultiplier":
                scale.multiplier.set(state.typeScaleMultiplier);
                break;
            case "typeScaleLineHeightRatio":
                scale.lineHeightRatio.set(state.typeScaleLineHeightRatio);
                break;
            case "typeScaleLineHeightMultilineRatio":
                scale.lineHeightMultilineRatio.set(state.typeScaleLineHeightMultilineRatio);
                break;
            case "typeScaleLineHeightSnap":
                scale.lineHeightSnap.set(px(state.typeScaleLineHeightSnap));
                break;
            default:
                break;
        }
    }

    private updatePalettes(canvas: ExplorerLibrary): void {
        const { color } = canvas.tokens;
        this.neutralPalette = color.neutral.palette.$value;
        this.neutralColors = this.neutralPalette.swatches.map(formatColor);
        this.accentPalette = color.accent.palette.$value;
        this.highlightPalette = color.highlight.palette.$value;
        this.updateBackgrounds();
    }

    private updateBackgrounds(): void {
        const layers: SwatchInfo[] = this.layerProbes.flatMap(probe => this.layerSwatches(probe));

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

    // The fixed layers of a library, a swatch for each color, with the titles of the layers that have it, in the order of the palette.
    private layerSwatches(probe: ExplorerLibrary): SwatchInfo[] {
        const ramp = probe.tokens.color.layer.fill.ramp;
        return layerFills
            .map(([position, title]): SwatchInfo => {
                const color = formatColor(ramp[position].$value);
                return {
                    index: this.neutralColors.indexOf(color),
                    color,
                    title,
                };
            })
            .reduce((accumulated: SwatchInfo[], value: SwatchInfo): SwatchInfo[] => {
                const colorIndex: number = accumulated.findIndex(
                    (config: SwatchInfo): boolean => config.color === value.color
                );

                return colorIndex === -1
                    ? accumulated.concat(value)
                    : accumulated.map(
                        (config: SwatchInfo, index: number): SwatchInfo =>
                            index === colorIndex
                                ? {
                                    index: value.index,
                                    color: value.color,
                                    title: `${value.title}, ${config.title}`,
                                }
                                : config
                    );
            }, [])
            .sort((a: SwatchInfo, b: SwatchInfo): number => a.index - b.index);
    }
}
