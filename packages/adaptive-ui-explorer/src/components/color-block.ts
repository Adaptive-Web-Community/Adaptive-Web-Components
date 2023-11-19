import { Swatch } from "@adaptive-web/adaptive-ui";
import {
    accentFillDiscernibleControlStyles,
    accentFillReadableControlStyles,
    accentFillStealthControlStyles,
    accentFillSubtleControlStyles,
    accentForegroundReadableControlStyles,
    accentOutlineDiscernibleControlStyles,
    fillColor,
    highlightFillDiscernibleControlStyles,
    highlightFillReadableControlStyles,
    highlightFillStealthControlStyles,
    highlightFillSubtleControlStyles,
    highlightForegroundReadableControlStyles,
    highlightOutlineDiscernibleControlStyles,
    neutralDividerDiscernibleElementStyles,
    neutralDividerSubtleElementStyles,
    neutralFillDiscernibleControlStyles,
    neutralFillReadableControlStyles,
    neutralFillStealthControlStyles,
    neutralFillSubtleControlStyles,
    neutralForegroundReadableElementStyles,
    neutralForegroundStrongElementStyles,
    neutralOutlineDiscernibleControlStyles,
    neutralStrokeReadableRest
} from '@adaptive-web/adaptive-ui/reference';
import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    Updates,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { ComponentType } from "../component-type.js";
import "./adaptive-component.js";
import "./style-example.js";
import "./swatch.js";

const backplateComponents = html<ColorBlock>`
    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => accentFillReadableControlStyles}">
        Accent readable
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => accentFillStealthControlStyles}">
        Accent stealth
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => accentFillSubtleControlStyles}">
        Accent subtle
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralFillReadableControlStyles}">
        Neutral readable
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralFillStealthControlStyles}">
        Neutral stealth
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralFillSubtleControlStyles}">
        Neutral subtle
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => highlightFillReadableControlStyles}">
        Highlight readable
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => highlightFillStealthControlStyles}">
        Highlight stealth
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => highlightFillSubtleControlStyles}">
        Highlight subtle
    </app-style-example>
`;

const textComponents = html<ColorBlock>`
    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => accentForegroundReadableControlStyles}">
        Accent control
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralForegroundStrongElementStyles}">
        Neutral element
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralForegroundReadableElementStyles}">
        Hint / placeholder element
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => highlightForegroundReadableControlStyles}">
        Highlight control
    </app-style-example>
`;

const formComponents = html<ColorBlock>`
    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => accentOutlineDiscernibleControlStyles}">
        Accent outline
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => accentFillDiscernibleControlStyles}">
        Accent discernible
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralOutlineDiscernibleControlStyles}">
        Neutral outline
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralFillDiscernibleControlStyles}">
        Neutral discernible
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralDividerSubtleElementStyles}">
        Divider subtle
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => neutralDividerDiscernibleElementStyles}">
        Divider discernible
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => highlightOutlineDiscernibleControlStyles}">
        Highlight outline
    </app-style-example>

    <app-style-example :disabledState=${x => x.disabledState} :styles="${x => highlightFillDiscernibleControlStyles}">
        Highlight discernible
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

    @observable
    public disabledState: boolean = false;

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
            const swatch =Swatch.parse(this.color)
            if (swatch) {
                fillColor.setValueFor(this, swatch);
            }
        }
    }
}
