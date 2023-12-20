import { customElement, FASTElement } from "@microsoft/fast-element";
import { samplePageStyles as styles } from "./sample-page.styles.js";
import { samplePageTemplate as template } from "./sample-page.template.js";

@customElement({
    name: "app-sample-page",
    template: template(),
    styles,
})
export class SamplePage extends FASTElement {}
