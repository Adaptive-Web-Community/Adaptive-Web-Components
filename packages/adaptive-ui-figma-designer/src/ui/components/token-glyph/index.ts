import { attr, css, customElement, ElementStyles, FASTElement, html, observable } from "@microsoft/fast-element";
import { cornerRadiusControl } from "@adaptive-web/adaptive-ui/reference";
import { parseColor } from "@microsoft/fast-colors";
import { ElementStylesRenderer, Styles } from "@adaptive-web/adaptive-ui";
import { staticallyCompose } from "@microsoft/fast-foundation";
import BlobIcon from "../../assets/blob.svg";

const template = html<TokenGlyph>`
    <template
        class=${x => (x.value === "none" && x.type !== TokenGlyphType.stylesSwatch ? "none" : "")}
        tabindex=${x => (x.interactive ? "0" : null)}
        role=${x => (x.interactive ? "button" : null)}
    >
        <div
            part="swatch"
            class="swatch"
            style=${x => (!x.value || x.value === "none" ? "" : `--swatch-value: ${x.valueColor}`)}
        >
            <span class="text">Ag</span>
            <span class="icon">${staticallyCompose(BlobIcon)}</span>
        </div>
    </template>
`;

const styles = css`
    :host {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        cursor: default;
    }

    .swatch {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: calc(${cornerRadiusControl} * 2);
    }

    .text,
    .icon {
        display: none;
    }

    :host([type="background"]) .swatch,
    :host([type="border"]) .swatch {
        background-color: var(--swatch-value);
        border: 1px solid #e8e8e8;
    }

    :host([type="border"]) .swatch::before {
        display: block;
        content: "";
        position: absolute;
        top: 6px;
        bottom: 6px;
        left: 6px;
        right: 6px;
        box-sizing: border-box;
        background: var(--fill-color);
        border: 1px solid #e8e8e8;
        border-radius: calc(${cornerRadiusControl} * 2);
    }

    :host([type="icon"]) .swatch {
        position: relative;
        width: 28px;
        height: 28px;
        overflow: hidden;
        color: var(--swatch-value);
    }

    :host([type="icon"]) .icon {
        display: block;
    }

    :host([type="icon"]) svg {
        fill: currentcolor;
    }

    :host(.none) .swatch::after {
        display: block;
        content: "";
        width: 1px;
        height: 32px;
        background: #ff3366;
        left: calc(50% - 0.5px);
        position: relative;
        transform-origin: center;
        transform: rotate(45deg);
    }

    :host([type="styles"]) .text {
        display: block;
    }

    :host([circular]) .swatch,
    :host([circular]) .swatch::before {
        border-radius: 50%;
    }

    :host([interactive]) {
        outline: none;
        cursor: pointer;
    }
`;

export enum TokenGlyphType {
    backgroundSwatch = "background",
    borderSwatch = "border",
    stylesSwatch = "styles",
    icon = "icon",
}

const params = {
    interactivitySelector: "",
    nonInteractivitySelector: "",
    part: "swatch",
};

@customElement({
    name: "designer-token-glyph",
    template,
    styles,
})
export class TokenGlyph extends FASTElement {
    @attr
    public type: TokenGlyphType = TokenGlyphType.backgroundSwatch;

    @attr({ mode: "boolean" })
    public circular: boolean = false;

    @attr
    public value: string | "none" = "none";
    protected valueChanged(prev: string, next: string) {
        const color = parseColor(next);
        this.valueColor = color?.toStringWebRGBA();
    }

    @observable
    public valueColor: string;

    @observable
    public styles?: Styles;
    protected stylesChanged(prev: Styles, next: Styles) {
        if (prev) {
            this.$fastController.removeStyles(this._addedStyles);
        }
        if (next) {
            this._addedStyles = new ElementStylesRenderer(next).render(params);
            this.$fastController.addStyles(this._addedStyles);
        }
    }

    @attr({ mode: "boolean" })
    public interactive: boolean = false;

    // Keep track of the styles we added so we can remove them without recreating.
    private _addedStyles: ElementStyles;
}
