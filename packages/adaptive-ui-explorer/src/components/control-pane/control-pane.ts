import { FASTElement, observable } from "@microsoft/fast-element";

export class ControlPane extends FASTElement {
    @observable
    public componentType: string;

    @observable
    public accentColor: string;

    @observable
    public neutralColor: string;

    @observable
    public showOnlyLayerBackgrounds: boolean = true;

    public updateFormValue(field: string, value: any) {
        this.$emit("formvaluechange", { field: field, value: value });
    }
}
