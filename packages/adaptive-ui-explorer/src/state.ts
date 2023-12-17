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
}

export class DefaultState implements State {
    @observable
    public componentType: ComponentType = ComponentType.backplate;

    @observable
    public neutralColor: string;

    @observable
    public accentColor: string;

    @observable
    public highlightColor: string;

    @observable
    public showOnlyLayerBackgrounds: boolean = true;

    @observable
    public wcagContrastLevel: WcagContrastLevel = WcagContrastLevel.aa;

    @observable
    public disabledState: boolean = false;
}
