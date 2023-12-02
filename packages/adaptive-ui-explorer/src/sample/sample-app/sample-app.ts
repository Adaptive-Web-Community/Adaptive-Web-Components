import { customElement, FASTElement } from "@microsoft/fast-element";
import { sampleAppStyles as styles } from "./sample-app.styles.js";
import { sampleAppTemplate as template } from "./sample-app.template.js";

@customElement({
    name: "app-sample-app",
    template: template(),
    styles,
})
export class SampleApp extends FASTElement {}
