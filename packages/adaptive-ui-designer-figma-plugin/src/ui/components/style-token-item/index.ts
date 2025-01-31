import { attr, css, customElement, FASTElement, html, observable, ref, when } from "@microsoft/fast-element";
import { Styles } from "@adaptive-web/adaptive-ui";
import { cornerRadiusControl, neutralFillStealthHover, neutralStrokeStrongRest } from "@adaptive-web/adaptive-ui/reference";
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
            (x) => x.glyphType || x.styles,
            html`
                <designer-token-glyph
                    ${ref("glyph")}
                    circular
                    :value=${(x) => x.value}
                    :styles=${(x) => x.styles}
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
        border-radius: ${cornerRadiusControl};
        color: ${neutralStrokeStrongRest};
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
        background: ${neutralFillStealthHover};
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

    @observable
    public styles?: Styles;
    protected stylesChanged() {
        this.setupGlyph();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setupGlyph();
    }

    private setupGlyph() {
        if (this.glyph && this.styles) {
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
