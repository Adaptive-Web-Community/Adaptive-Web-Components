import { Color } from "@adaptive-web/adaptive-ui";
import { colorContext, densityControl, neutralStrokeReadableRest, typeRampMinus1FontSize } from "@adaptive-web/adaptive-ui/reference";
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";
import {
    attr,
    css,
    customElement,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import { parse, wcagContrast } from "culori/fn";

export enum SwatchType {
    fill = "fill",
    foreground = "foreground",
    outline = "outline",
}

function template<T extends AppSwatch>(): ElementViewTemplate<T> {
    return html<T>`
        <div
            class="icon"
            style="${x => x.iconStyle}"
            title="${x => x.contrastMessage}"
        ></div>
        <code class="recipe-name" title="${x => x.recipeName}">${x => x.recipeName}</code>
        <code class="hex-code">${x => x.colorValue}</code>
    `;
}

const styles = css`
    ${componentBaseStyles}

    :host {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        justify-items: start;
        grid-column-gap: ${densityControl.horizontalGap};
        color: ${neutralStrokeReadableRest};
        font-size: ${typeRampMinus1FontSize};
    }

    :host([type="foreground"]) .icon::before {
        font-size: 13px;
        content: "A";
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 2px;
        box-sizing: border-box;
    }

    .recipe-name {
        grid-column: 2;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        text-align: start;
    }

    .hex-code {
        grid-column: 3;
    }
`;

@customElement({
    name: "app-swatch",
    template: template(),
    styles,
})
export class AppSwatch extends FASTElement {
    @attr
    public type?: SwatchType;

    @attr({ attribute: "recipe-name" })
    public recipeName?: string;

    @observable
    public foregroundRecipe?: DesignToken<Color>;
    protected foregroundRecipeChanged() {
        this.updateObservables();
    }

    @observable
    public fillRecipe?: DesignToken<Color>;
    protected fillRecipeChanged() {
        this.updateObservables();
    }

    @observable
    public outlineRecipe?: DesignToken<Color>;
    protected outlineRecipeChanged() {
        this.updateObservables();
    }

    @observable
    public iconStyle?: string;

    @observable
    public contrastMessage?: string;

    @observable
    public colorValue?: string;

    public connectedCallback() {
        super.connectedCallback();

        colorContext.subscribe(this);

        this.updateObservables();
    }

    public disconnectedCallback() {
        super.disconnectedCallback();

        colorContext.unsubscribe(this);
    }

    public handleChange() {
        this.updateObservables();
    }

    private updateObservables() {
        this.updateIconStyle();
        this.updateContrastMessage();
        this.updateColorValue();
    }

    private tokenCSS(token?: DesignToken<Color>): string {
        return token && typeof (token as any).createCSS === "function"
            ? (token as any).createCSS()
            : "";
    }

    private evaluateToken(token?: DesignToken<Color>): string {
        return token?.getValueFor(this).toColorString() || "";
    }

    private updateIconStyle(): void {
        const background = `background-color: ${this.tokenCSS(this.fillRecipe)}`;
        this.iconStyle =
            this.type === SwatchType.outline
                ? `border: 4px solid ${this.tokenCSS(this.outlineRecipe)}; ${background}`
                : this.type === SwatchType.foreground
                ? `color: ${this.tokenCSS(this.foregroundRecipe)}; ${background}`
                : background;
    }

    private formatContrast(a?: DesignToken<Color>, b?: DesignToken<Color>): string {
        return a && b
            ? wcagContrast(
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  parse(this.evaluateToken(a))!,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  parse(this.evaluateToken(b))!
              ).toFixed(2)
            : "";
    }

    private formatContrastMessage(
        a?: DesignToken<Color>,
        b?: DesignToken<Color>
    ): string {
        return `Contrast: ${this.formatContrast(a, b)} : 1`;
    }

    private updateContrastMessage(): void {
        const contrastMessage: string = this.formatContrastMessage(
            this.type === SwatchType.foreground
                ? this.foregroundRecipe
                : this.type === SwatchType.outline
                ? this.outlineRecipe
                : this.fillRecipe,
            this.type === SwatchType.foreground
                ? this.fillRecipe
                : colorContext
        );

        this.contrastMessage = contrastMessage;
    }

    private updateColorValue(): void {
        const recipe =
            this.type === SwatchType.outline
                ? this.outlineRecipe
                : this.type === SwatchType.foreground
                ? this.foregroundRecipe
                : this.fillRecipe;
        this.colorValue = this.evaluateToken(recipe).toUpperCase();
    }
}
