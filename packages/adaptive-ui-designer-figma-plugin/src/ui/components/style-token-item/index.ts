import { attr, css, customElement, FASTElement, html, observable, ref, when } from "@microsoft/fast-element";
import { InteractiveState } from "@adaptive-web/adaptive-ui";
import { properties, stateVar } from "../../tokens/library.js";
import { TokenGlyph, TokenGlyphValueType } from "../token-glyph/index.js";

// TODO, make a button
const template = html<StyleTokenItem>`
    <template>
        <span
            class="content"
            role=${x => (x.contentButton ? "button" : null)}
            @click="${(x, c) => x.handleContentClick(c.event)}"
        >
            ${(x) => x.title}
        </span>
        ${when(
            (x) => x.glyphType || x.swatchStyle,
            html`
                <designer-token-glyph
                    ${ref("glyph")}
                    circular
                    :value=${(x) => x.value}
                    :swatchStyle=${(x) => x.swatchStyle}
                    valueType=${(x) => x.glyphType}
                >
                </designer-token-glyph>
            `,
            html`
                <span class="value">${(x) => x.value}</span>
            `
        )}
        <slot name="actions"></slot>
    </template>
`;

const styles = css`
    :host {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .content {
        display: flex;
        justify-content: space-between;
        flex-grow: 1;
        border-radius: ${properties.shape.cornerRadius.default.var};
        color: ${properties.color.neutral.stroke.strong.var};
        padding: 8px 4px;
    }

    .value {
        /* Needs a better UI, but cap for long values like font family */
        max-width: 50%;
    }

    .content,
    .value {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .content[role="button"]:hover {
        background: ${stateVar(properties.color.neutral.fill.stealth, InteractiveState.hover)};
        cursor: pointer;
    }
`;

@customElement({
    name: "designer-style-token-item",
    template,
    styles,
})
export class StyleTokenItem extends FASTElement {
    @attr
    public title: string = "";

    @attr
    public value: string | null = null;

    @attr
    public glyphType?: TokenGlyphValueType;

    public glyph?: TokenGlyph;

    @attr({ attribute: "content-button", mode: "boolean" })
    public contentButton: boolean = false;

    /**
     * The style of a swatch that shows a treatment, instead of the value of a token.
     */
    @observable
    public swatchStyle?: string;
    protected swatchStyleChanged() {
        this.setupGlyph();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setupGlyph();
    }

    private setupGlyph() {
        if (this.glyph && this.swatchStyle) {
            if (this.glyphType === TokenGlyphValueType.foreground) {
                this.glyph.icon = true;
            }
            this.glyph.valueType = null;
            this.glyph.interactive = true;
        }
    }

    public handleContentClick(event: Event): void {
        this.$emit("itemClick", event);
    }
}
