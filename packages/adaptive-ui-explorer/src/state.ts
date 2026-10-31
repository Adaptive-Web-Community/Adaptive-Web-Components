import { observable } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context.js";
import { type Color, evaluate, WcagContrastLevel } from "@adaptive-web/adaptive-ui";
import { ComponentType } from "./component-type.js";
import type { ExplorerLibrary } from "./library.js";

export const State = Context.create<State>("State");
export interface State {
    componentType: ComponentType;
    neutralColor: Color;
    neutralAsOverlay: boolean;
    accentColor: Color;
    highlightColor: Color;
    showOnlyLayerBackgrounds: boolean;
    wcagContrastLevel: WcagContrastLevel;
    disabledState: boolean;
    showSwatches: boolean;
    typeScaleBaseSize: number;
    typeScaleMultiplier: number;
    typeScaleLineHeightRatio: number;
    typeScaleLineHeightMultilineRatio: number;
    typeScaleLineHeightSnap: number;
    multiline: boolean;
}

// A number of a dimension in px, or a number, as a control shows it.
function numberOf(value: Parameters<typeof evaluate>[0], library: ExplorerLibrary): number {
    const evaluated = evaluate(value, library);
    return typeof evaluated === "number" ? evaluated : evaluated.value;
}

/**
 * The state of the controls, which starts at the values of the library that the app sets them on.
 */
export class DefaultState implements State {
    constructor(library: ExplorerLibrary) {
        const { color, typography } = library.tokens;
        const scale = typography.ramp.body;
        this.neutralColor = color.neutral.base.$value;
        this.neutralAsOverlay = color.neutral.asOverlay.$value;
        this.accentColor = color.accent.base.$value;
        this.highlightColor = color.highlight.base.$value;
        this.wcagContrastLevel = color.wcagContrast.level.$value;
        this.typeScaleBaseSize = numberOf(scale.fontSize.base.$value, library);
        this.typeScaleMultiplier = scale.multiplier.$value;
        this.typeScaleLineHeightRatio = scale.lineHeightRatio.$value;
        this.typeScaleLineHeightMultilineRatio = scale.lineHeightMultilineRatio.$value;
        this.typeScaleLineHeightSnap = scale.lineHeightSnap.$value.value;
    }

    @observable
    public componentType: ComponentType = ComponentType.backplate;

    @observable
    public neutralColor: Color;

    @observable
    public neutralAsOverlay: boolean;

    @observable
    public accentColor: Color;

    @observable
    public highlightColor: Color;

    @observable
    public showOnlyLayerBackgrounds: boolean = true;

    @observable
    public wcagContrastLevel: WcagContrastLevel;

    @observable
    public disabledState: boolean = false;

    @observable
    public showSwatches: boolean = false;

    @observable
    public typeScaleBaseSize: number;

    @observable
    public typeScaleMultiplier: number;

    @observable
    public typeScaleLineHeightRatio: number;

    @observable
    public typeScaleLineHeightMultilineRatio: number;

    @observable
    public typeScaleLineHeightSnap: number;

    @observable
    public multiline: boolean = false;
}
