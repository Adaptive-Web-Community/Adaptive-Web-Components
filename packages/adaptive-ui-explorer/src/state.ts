import { observable } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context.js";
import { Color } from "@adaptive-web/adaptive-ui";
import { WcagContrastLevel } from "@adaptive-web/adaptive-ui/reference";
import { ComponentType } from "./component-type.js";

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

const PLACEHOLDER_COLOR = Color.parse("#ff00ff")!;

export class DefaultState implements State {
    @observable
    public componentType: ComponentType = ComponentType.backplate;

    @observable
    public neutralColor: Color = PLACEHOLDER_COLOR;

    @observable
    public neutralAsOverlay: boolean = false;

    @observable
    public accentColor: Color = PLACEHOLDER_COLOR;

    @observable
    public highlightColor: Color = PLACEHOLDER_COLOR;

    @observable
    public showOnlyLayerBackgrounds: boolean = true;

    @observable
    public wcagContrastLevel: WcagContrastLevel = WcagContrastLevel.aa;

    @observable
    public disabledState: boolean = false;

    @observable
    public showSwatches: boolean = false;

    @observable
    public typeScaleBaseSize: number = 16;

    @observable
    public typeScaleMultiplier: number = 1.2;

    @observable
    public typeScaleLineHeightRatio: number = 1.3;

    @observable
    public typeScaleLineHeightMultilineRatio: number = 1.6;

    @observable
    public typeScaleLineHeightSnap: number = 2;

    @observable
    public multiline: boolean = false;
}
