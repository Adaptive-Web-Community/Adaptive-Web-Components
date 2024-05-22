import { attr, css, customElement, FASTElement, html, when } from "@microsoft/fast-element";
import { cornerRadiusControl, neutralFillStealthHover, neutralStrokeStrongRest } from "@adaptive-web/adaptive-ui/reference";
import { TokenGlyphType } from "../token-glyph/index.js";

// TODO, make a button
const template = html<StyleTokenItem>`
    <template>
        <span
            class="content"
            role=${x => (x.contentButton ? "button" : null)}
        >
            ${(x) => x.title}
        </span>
        ${when(
            (x) => x.glyphType,
            html`
                <designer-token-glyph
                    circular
                    value=${(x) => x.value}
                    type=${(x) => x.glyphType}
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
    public title: string;

    @attr
    public value: string;

    @attr
    public glyphType?: TokenGlyphType;

    @attr({ attribute: "content-button", mode: "boolean" })
    public contentButton: boolean = false;
}
