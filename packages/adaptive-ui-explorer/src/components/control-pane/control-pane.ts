import type { WcagContrastLevel } from "@adaptive-web/adaptive-ui/reference";
import { FASTElement, observable } from "@microsoft/fast-element";

export class ControlPane extends FASTElement {
    @observable
    public componentType: string;

    @observable
    public accentColor: string;

    @observable
    public highlightColor: string;

    @observable
    public neutralColor: string;

    @observable
    public showOnlyLayerBackgrounds: boolean = true;

    @observable
    public wcagContrastLevel: WcagContrastLevel = "aa";

    public updateFormValue(field: string, value: any) {
        this.$emit("formvaluechange", { field: field, value: value });
    }
}
