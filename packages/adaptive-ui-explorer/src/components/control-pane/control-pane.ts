import { customElement, FASTElement } from "@microsoft/fast-element";
import { State } from "../../state.js";
import { controlPaneStyles as styles } from "./control-pane.styles.js";
import { controlPaneTemplate as template } from "./control-pane.template.js";

@customElement({
    name: "app-control-pane",
    styles,
    template: template(),
})
export class ControlPane extends FASTElement {
    @State state!: State;
}
