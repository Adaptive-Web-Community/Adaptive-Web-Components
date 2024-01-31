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
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";
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
import { AdaptiveComponent } from "./adaptive-component.js";
import { StyleExample } from "./style-example.js";
import { AppSwatch } from "./swatch.js";

AdaptiveComponent;
StyleExample;
AppSwatch;

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
    <div class="title">
        <p class="swatch">${x => `Swatch ${x.index} - ${x.color}`}</p>
        <p class="layerName">
            ${when(
                x => x.layerName,
                html`
                    Layer: ${x => x.layerName}
                `
            )}
        </p>
    </div>
    ${x => x.componentTypeTemplate()}
`;

const styles = css`
    ${componentBaseStyles}

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
        padding: 36px;
        gap: 24px;
        background-color: ${fillColor};
        color: ${neutralStrokeReadableRest};
    }

    .title {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .title p {
        margin: 0;
    }

    .swatch {
        font-weight: 600;
        text-transform: uppercase;
    }

    .layerName {
        font-weight: normal;
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
