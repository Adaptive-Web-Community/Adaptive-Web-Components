import type { WcagContrastLevel } from "@adaptive-web/adaptive-ui/reference";
import { customElement, FASTElement, observable } from "@microsoft/fast-element";
import { controlPaneStyles as styles } from "./control-pane.styles.js";
import { controlPaneTemplate as template } from "./control-pane.template.js";

@customElement({
    name: "app-control-pane",
    styles,
    template: template(),
})
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

    @observable
    public disabledState: boolean = false;

    public updateFormValue(field: string, value: any) {
        this.$emit("formvaluechange", { field: field, value: value });
    }
}
