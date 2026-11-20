import { attr, css, customElement, FASTElement, html, observable } from "@microsoft/fast-element";
import { staticallyCompose } from "@adaptive-web/components-fast";
import { formatHex8, parse } from "culori/fn";
import BlobIcon from "../../assets/blob.svg";
import { properties } from "../../tokens/library.js";

const template = html<TokenGlyph>`
    <template
        class=${x => (x.valueType !== null && x.value === null ? "none" : null)}
        tabindex=${x => (x.interactive ? "0" : null)}
        role=${x => (x.interactive ? "button" : null)}
    >
        <div
            part="swatch"
            class="swatch"
            style=${x => [x.value !== null ? `--swatch-value: ${x.valueColor}` : "", x.shownStyle ?? ""].filter(Boolean).join("; ") || null}
        >
            <span class="text">Ag</span>
            <span class="icon">${staticallyCompose(BlobIcon)}</span>
        </div>
    </template>
`;

const styles = css`
    :host {
        position: relative;
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
        border-radius: calc(${properties.shape.cornerRadius.default.var} * 2);
        /* Resets for 'style' type, here for specificity */
        color: transparent;
        border: solid 6px transparent;
    }

    .text {
        user-select: none;
    }

    .icon {
        display: none;
    }

    svg {
        fill: currentcolor;
    }

    :host([valueType="background"]) .swatch {
        background-color: var(--swatch-value);
    }

    :host([valueType="border"]) .swatch {
        border-color: var(--swatch-value);
    }

    /* Pseudo border rings */
    :host([valueType="border"]) .swatch::before,
    :host([valueType="background"]) .swatch::after,
    :host([valueType="border"]) .swatch::after {
        display: block;
        content: "";
        position: absolute;
        box-sizing: border-box;
        border: 1px solid #e8e8e8;
        border-radius: inherit;
    }

    /* Inner pseudo border ring */
    :host([valueType="border"]) .swatch::before {
        inset: 0;
    }

    /* Outer pseudo border ring */
    :host([valueType="background"]) .swatch::after,
    :host([valueType="border"]) .swatch::after {
        inset: -8px;
    }

    :host([valueType="foreground"]) .swatch,
    :host([icon]) .swatch {
        position: relative;
        width: 28px;
        height: 28px;
        overflow: hidden;
    }

    :host([valueType="foreground"]) .swatch {
        color: var(--swatch-value);
    }

    :host([valueType="foreground"]) .icon,
    :host([icon]) .icon {
        display: block;
    }

    :host([valueType="foreground"]) .text,
    :host([icon]) .text {
        display: none;
    }

    :host(.none)::after {
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

    :host([circular]) .swatch {
        border-radius: 50%;
    }

    :host([interactive]) {
        outline: none;
        cursor: pointer;
    }
`;

export enum TokenGlyphValueType {
    background = "background",
    foreground = "foreground",
    border = "border",
}

const PLACEHOLDER_COLOR = "#ff00ff";

@customElement({
    name: "designer-token-glyph",
    template,
    styles,
})
export class TokenGlyph extends FASTElement {
    @attr
    public valueType: TokenGlyphValueType | null = TokenGlyphValueType.background;

    @attr
    public value: string | null = null;
    protected valueChanged(prev: string | null, next: string | null) {
        const color = next === null ? undefined : parse(next);
        this.valueColor = (color && formatHex8(color)) || PLACEHOLDER_COLOR;
    }

    @observable
    public valueColor: string = PLACEHOLDER_COLOR;

    /**
     * The style of the swatch, for a treatment, where the swatch shows the properties of the treatment instead of a value.
     *
     * @remarks
     * The properties of a style that are only fonts have no foreground to show them with, which is set here.
     */
    @observable
    public swatchStyle?: string;

    /**
     * The style that is shown, which is the style of the swatch with the foreground that the fonts need.
     */
    @observable
    public shownStyle?: string;
    protected swatchStyleChanged(prev?: string, next?: string) {
        this.shownStyle = next && /font-/.test(next) && !/(^|; )color:/.test(next) ? `color: ${properties.color.neutral.stroke.strong.var}; ${next}` : next;
    }

    @attr({ mode: "boolean" })
    public circular: boolean = false;

    @attr({ mode: "boolean" })
    public icon: boolean = false;

    @attr({ mode: "boolean" })
    public interactive: boolean = false;

}
