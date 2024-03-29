import { attr, css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { neutralFillStealthHover, neutralStrokeReadableRest } from "@adaptive-web/adaptive-ui/reference";

const template = html<CornerRadius>`
    <template
        class="${x => x.orientation} ${x => (x.interactive ? "interactive" : "")} ${x =>
            x.selected ? "selected" : ""}"
        style="--radius: ${x => x.value}"
        tabindex="${x => (x.interactive ? "interactive" : null)}"
        aria-selected="${x => x.selected}"
    >
        <div class="indicator"></div>
        <slot></slot>
    </template>
`;

const styles = css`
    :host {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        text-align: center;
        color: ${neutralStrokeReadableRest};
    }

    .indicator {
        width: 28px;
        height: 28px;
        position: relative;
        overflow: hidden;
    }

    .indicator::before {
        content: "";
        display: block;
        width: 200%;
        height: 200%;
        border: 4px solid black;
        border-radius: calc(var(--radius) * 3);
    }

    :host(.vertical) {
        flex-direction: column;
        padding: 8px;
    }

    :host(.vertical) .indicator {
        margin-bottom: 8px;
    }

    :host(.horizontal) .indicator {
        margin-inline-end: 12px;
    }

    :host(.interactive) {
        outline: none;
    }

    :host(.interactive:hover) {
        cursor: pointer;
        background: ${neutralFillStealthHover};
    }

    :host(.selected),
    :host(.selected:hover) {
        background: #daebf7;
    }
`;

@customElement({
    name: "designer-corner-radius",
    template,
    styles,
})
export class CornerRadius extends FASTElement {
    @attr
    public value: string = "0";

    @attr
    public orientation: "vertical" | "horizontal" = "vertical";

    @attr({ mode: "boolean" })
    public interactive: boolean = false;

    @attr({ mode: "boolean" })
    public selected: boolean = false;
}
