import { observable } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context.js";
import { WcagContrastLevel } from "@adaptive-web/adaptive-ui/reference";
import { ComponentType } from "./component-type.js";

export const State = Context.create<State>("State");
export interface State {
    componentType: ComponentType;
    neutralColor: string;
    accentColor: string;
    highlightColor: string;
    showOnlyLayerBackgrounds: boolean;
    wcagContrastLevel: WcagContrastLevel;
    disabledState: boolean;
    showSwatches: boolean;
}

const PLACEHOLDER_COLOR = "#ff00ff";

export class DefaultState implements State {
    @observable
    public componentType: ComponentType = ComponentType.backplate;

    @observable
    public neutralColor: string = PLACEHOLDER_COLOR;

    @observable
    public accentColor: string = PLACEHOLDER_COLOR;

    @observable
    public highlightColor: string = PLACEHOLDER_COLOR;

    @observable
    public showOnlyLayerBackgrounds: boolean = true;

    @observable
    public wcagContrastLevel: WcagContrastLevel = WcagContrastLevel.aa;

    @observable
    public disabledState: boolean = false;

    @observable
    public showSwatches: boolean = false;
}
