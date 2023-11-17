import { css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { staticallyCompose } from "@microsoft/fast-foundation";
import { webhook } from "@primer/octicons";

const template = html<App>`
    <adaptive-button>
        ${staticallyCompose(webhook.toSVG())}
        Octicons
    </adaptive-button>
`;

const styles = css`
`;

@customElement({
    name: "example-app",
    template,
    styles,
})
export class App extends FASTElement {
}
