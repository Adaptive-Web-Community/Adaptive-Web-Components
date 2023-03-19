import {
    accentBaseColor,
    accentPalette,
    LayerBaseLuminance,
    layerFillBaseLuminance,
    layerFillFixedBase,
    layerFillFixedMinus1,
    layerFillFixedMinus2,
    layerFillFixedMinus3,
    layerFillFixedMinus4,
    layerFillFixedPlus1,
    neutralBaseColor,
    neutralPalette,
    Palette,
    Swatch,
    SwatchRGB,
    wcagContrastLevel,
} from "@adaptive-web/adaptive-ui";
import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    ref,
    repeat,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import { ComponentType } from "./component-type.js";
import "./components/color-block.js";
import "./components/control-pane/index.js";
import "./components/layer-background/index.js";
import "./components/palette-gradient/palette-gradient.js";

DesignToken.registerDefaultStyleTarget();

const colorBlockTemplate = html<App>`
    ${repeat(
        (x) => x.backgrounds,
        html<SwatchInfo, App>`
            <app-color-block
                id="${(x) => x.color.toUpperCase().replace("#", "")}"
                index="${(x, c) => x.index}"
                component="${(x, c) => c.parent.componentType}"
                color="${(x) => x.color}"
                layer-name="${(x) => x.title}"
            ></app-color-block>
        `
    )}
`;

const template = html<App>`
    <div class="container fill">
        <div class="row fill">
            <app-design-system-provider class="canvas" ${ref("canvas")}>
                <app-design-system-provider ${ref("designSystemElement")}></app-design-system-provider>
                <div class="container fill">
                    <div class="row gradient">
                        <app-palette-gradient :palette="${(x) => x.neutralPalette}"></app-palette-gradient>
                    </div>
                    <div class="row gradient">
                        <app-palette-gradient :palette="${(x) => x.accentPalette}"></app-palette-gradient>
                    </div>
                    <div class="row fill">
                        <div style="display: flex; overflow: auto;">${(x) => x.componentTypeTemplate()}</div>
                    </div>
                </div>
            </app-design-system-provider>
            <div>
                <app-layer-background
                    id="control-pane"
                    class="control-pane-container"
                    base-layer-luminance="${LayerBaseLuminance.DarkMode}"
                    background-layer-recipe="-1"
                >
                    <app-control-pane
                        :componentType="${(x) => x.componentType}"
                        :neutralColor="${(x) => x.neutralColor}"
                        :accentColor="${(x) => x.accentColor}"
                        :showOnlyLayerBackgrounds="${(x) => x.showOnlyLayerBackgrounds}"
                        @formvaluechange="${(x, c) => x.controlPaneHandler(c.event as CustomEvent)}"
                    ></app-control-pane>
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

    .gradient {
        height: 20px;
    }

    .control-pane-container {
        height: 100%;
        z-index: 1;
        padding: 40px;
        position: relative;
        overflow: auto;
        width: 320px;
        box-sizing: border-box;
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
    template: html`
        <slot></slot>
    `,
})
class DesignSystemProvider extends FASTElement {}
DesignSystemProvider;

export interface AppAttributes {
    componentType: ComponentType;
    neutralColor: string;
    accentColor: string;
    showOnlyLayerBackgrounds: boolean;
}

@customElement({
    name: "app-main",
    template,
    styles,
})
export class App extends FASTElement implements AppAttributes {
    public canvas: DesignSystemProvider;

    @attr({ attribute: "component-type" })
    public componentType: ComponentType = ComponentType.backplate;

    @attr({ attribute: "neutral-color" })
    public neutralColor: string;
    protected neutralColorChanged(prev?: string, next?: string) {
        if (this.$fastController.isConnected && next) {
            neutralBaseColor.setValueFor(this.canvas, next);

            this.neutralPalette = neutralPalette.getValueFor(this.canvas);
            this.neutralColors = this.neutralPalette.swatches.map((x: SwatchRGB) => x.toColorString());

            this.updateBackgrounds();
        }
    }

    @observable
    public neutralPalette: Palette;

    @observable
    public neutralColors: string[] = [];

    @attr({ attribute: "accent-color" })
    public accentColor: string;
    protected accentColorChanged(prev?: string, next?: string) {
        if (this.$fastController.isConnected && next) {
            accentBaseColor.setValueFor(this.canvas, next);

            this.accentPalette = accentPalette.getValueFor(this.canvas);
        }
    }

    @observable
    public accentPalette: Palette;

    @observable
    public showOnlyLayerBackgrounds: boolean = true;
    protected showOnlyLayerBackgroundsChanged() {
        if (this.$fastController.isConnected) {
            this.updateBackgrounds();
        }
    }

    @observable
    public backgrounds: SwatchInfo[];

    public connectedCallback() {
        super.connectedCallback();
        this.neutralColor = "#808080";
        this.accentColor = "#F26C0D";
    }

    public designSystemElement: FASTElement;

    public componentTypeTemplate(): ViewTemplate<App, any> {
        return colorBlockTemplate;
    }

    private updateBackgrounds(): void {
        const layers: SwatchInfo[] = this.lightModeLayers.concat(this.darkModeLayers);

        this.backgrounds = this.showOnlyLayerBackgrounds
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

    private layerTokens: Array<[DesignToken<Swatch>, string]> = [
        [layerFillFixedPlus1, "+1"],
        [layerFillFixedBase, "Base"],
        [layerFillFixedMinus1, "-1"],
        [layerFillFixedMinus2, "-2"],
        [layerFillFixedMinus3, "-3"],
        [layerFillFixedMinus4, "-4"],
    ];

    private resolveLayerRecipes = (luminance: number): SwatchInfo[] => {
        layerFillBaseLuminance.setValueFor(this.designSystemElement, luminance);

        return this.layerTokens
            .map((conf: [DesignToken<Swatch>, string]): SwatchInfo => {
                const color = conf[0].getValueFor(this.designSystemElement).toColorString();
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
    };

    private get lightModeLayers(): SwatchInfo[] {
        return this.resolveLayerRecipes(LayerBaseLuminance.LightMode);
    }

    private get darkModeLayers(): SwatchInfo[] {
        return this.resolveLayerRecipes(LayerBaseLuminance.DarkMode);
    }

    public controlPaneHandler(e: CustomEvent) {
        const detail: { field: string; value: any } = e.detail;
        if (detail.field === "wcagContrastLevel") {
            if (this.$fastController.isConnected) {
                wcagContrastLevel.setValueFor(this.canvas, detail.value);
            }
        } else {
            (this as any)[detail.field] = detail.value;
        }
    }
}
