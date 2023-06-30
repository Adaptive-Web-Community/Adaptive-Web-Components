import {
    accentFillDiscernibleControlStyles,
    accentFillReadableControlStyles,
    accentFillStealthControlStyles,
    accentFillSubtleControlStyles,
    accentForegroundReadableControlStyles,
    accentOutlineDiscernibleControlStyles,
    neutralDividerDiscernibleElementStyles,
    neutralDividerSubtleElementStyles,
    neutralFillDiscernibleControlStyles,
    neutralFillReadableControlStyles,
    neutralFillStealthControlStyles,
    neutralFillSubtleControlStyles,
    neutralForegroundReadableElementStyles,
    neutralForegroundStrongElementStyles,
    neutralOutlineDiscernibleControlStyles,
    SwatchRGB,
} from "@adaptive-web/adaptive-ui";
import { fillColor, neutralStrokeReadableRest } from '@adaptive-web/adaptive-ui/reference';
import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    Updates,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { ComponentType } from "../component-type.js";
import "./adaptive-component.js";
import "./style-example.js";
import "./swatch.js";

const backplateComponents = html<ColorBlock>`
    <app-style-example :styles="${x => accentFillReadableControlStyles}">
        Accent readable
    </app-style-example>

    <app-style-example :styles="${x => accentFillStealthControlStyles}">
        Accent stealth
    </app-style-example>

    <app-style-example :styles="${x => accentFillSubtleControlStyles}">
        Accent subtle
    </app-style-example>

    <app-style-example :styles="${x => neutralFillReadableControlStyles}">
        Neutral readable
    </app-style-example>

    <app-style-example :styles="${x => neutralFillStealthControlStyles}">
        Neutral stealth
    </app-style-example>

    <app-style-example :styles="${x => neutralFillSubtleControlStyles}">
        Neutral subtle
    </app-style-example>
`;

const textComponents = html<ColorBlock>`
    <app-style-example :styles="${x => accentForegroundReadableControlStyles}">
        Accent control
    </app-style-example>

    <app-style-example :styles="${x => neutralForegroundStrongElementStyles}">
        Neutral element
    </app-style-example>

    <app-style-example :styles="${x => neutralForegroundReadableElementStyles}">
        Hint / placeholder element
    </app-style-example>
`;

const formComponents = html<ColorBlock>`
    <app-style-example :styles="${x => accentOutlineDiscernibleControlStyles}">
        Accent outline
    </app-style-example>

    <app-style-example :styles="${x => accentFillDiscernibleControlStyles}">
        Accent discernible
    </app-style-example>

    <app-style-example :styles="${x => neutralOutlineDiscernibleControlStyles}">
        Neutral outline
    </app-style-example>

    <app-style-example :styles="${x => neutralFillDiscernibleControlStyles}">
        Neutral discernible
    </app-style-example>

    <app-style-example :styles="${x => neutralDividerSubtleElementStyles}">
        Divider subtle
    </app-style-example>

    <app-style-example :styles="${x => neutralDividerDiscernibleElementStyles}">
        Divider discernible
    </app-style-example>
`;

const template = html<ColorBlock>`
    <p class="title">
        SWATCH ${x => x.index} - ${x => x.color.toUpperCase()}
        ${when(
            x => x.layerName,
            html`
                <p>
                    <code>Layer: ${x => x.layerName}</code>
                </p>
            `
        )}
    </p>

    <div class="content">
        ${x => x.componentTypeTemplate()}
    </div>
`;

const styles = css`
    :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: stretch;
        text-align: center;
        position: relative;
        transition: opacity 0.1s linear;
        height: max-content;
        min-height: 100%;
        background-color: ${fillColor};
        color: ${neutralStrokeReadableRest};
    }

    .title {
        margin: 16px auto 4px;
        font-weight: 600;
        height: 34px;
        color: ${neutralStrokeReadableRest};
    }

    .title code {
        font-weight: normal;
    }

    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 36px 36px;
    }
`;

@customElement({
    name: "app-color-block",
    template,
    styles,
})
export class ColorBlock extends FASTElement {
    @attr
    public index: number;

    @attr
    public component: ComponentType;

    @attr
    public color: string;
    protected colorChanged(): void {
        Updates.enqueue(() => this.updateColor());
    }

    @attr({ attribute: "layer-name" })
    public layerName: string;

    public componentTypeTemplate(): ViewTemplate<ColorBlock, any> {
        switch (this.component) {
            case ComponentType.backplate:
                return backplateComponents;
            case ComponentType.text:
                return textComponents;
            case ComponentType.form:
                return formComponents;
            default:
                return html<ColorBlock>``;
        }
    }

    private updateColor(): void {
        if (this.color && this.$fastController.isConnected) {
            const color = parseColorHexRGB(this.color);
            if (color) {
                fillColor.setValueFor(this, SwatchRGB.from(color));
            }
        }
    }
}
