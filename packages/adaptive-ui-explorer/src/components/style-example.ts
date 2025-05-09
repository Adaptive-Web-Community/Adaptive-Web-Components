import { Color, InteractiveTokenGroup, StyleProperty, Styles, TypedCSSDesignToken } from "@adaptive-web/adaptive-ui";
import { densityControl, fillColor } from '@adaptive-web/adaptive-ui/reference';
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";
import { css, customElement, FASTElement, html, observable, repeat, volatile, when } from "@microsoft/fast-element";
import { AdaptiveComponent } from "./adaptive-component.js";
import { AppSwatch, SwatchType } from "./swatch.js";

AdaptiveComponent;
AppSwatch;

const swatchTemplate = html<StyleValue, StyleExample>`
    <app-swatch
        type="${x => x.type}"
        recipe-name="${x => x.tokenName}"
        :fillRecipe="${x => x.fillRecipe}"
        :foregroundRecipe="${x => x.foregroundRecipe}"
        :outlineRecipe="${x => x.outlineRecipe}"
    ></app-swatch>
`;

const swatchesTemplate = html<StyleExample>`
    ${repeat(x => x.styleValues, swatchTemplate)}
`;

const template = html<StyleExample>`
    <template>
        <div class="example">
            <app-adaptive-component ?disabled=${x => x.disabledState} :styles=${x => x.styles}>
                <slot></slot>
            </app-adaptive-component>
        </div>
        ${when(x => x.showSwatches, swatchesTemplate)}
    </template>
`;

const styles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        flex-direction: column;
        gap: ${densityControl.verticalGap};
    }

    .example {
        display: flex;
        justify-content: center;
        padding: 24px 0;
    }
`;

interface StyleValue {
    type: SwatchType;
    tokenName: string;
    foregroundRecipe?: TypedCSSDesignToken<Color>;
    fillRecipe?: TypedCSSDesignToken<Color>;
    outlineRecipe?: TypedCSSDesignToken<Color>;
}

@customElement({
    name: "app-style-example",
    template,
    styles,
})
export class StyleExample extends FASTElement {
    @observable
    public disabledState: boolean = false;

    @observable
    public showSwatches: boolean = false;

    @observable
    public styles?: Styles;
    
    @volatile
    public get styleValues(): StyleValue[] {
        const values: StyleValue[] = [];

        let backgroundRest = fillColor;
        let backgroundHover = fillColor;
        let backgroundActive = fillColor;
        let backgroundFocus = fillColor;

        const backgroundValue = this.styles?.effectiveProperties?.get(StyleProperty.backgroundFill);
        if (backgroundValue) {
            if (typeof backgroundValue === "string") {
                // ignore for now
            } else if (backgroundValue instanceof TypedCSSDesignToken) {
                backgroundRest = backgroundValue;
                values.push({
                    type: SwatchType.fill,
                    tokenName: (backgroundValue as TypedCSSDesignToken<any>).name,
                    fillRecipe: backgroundValue,
                });
            } else {
                const set = backgroundValue as InteractiveTokenGroup<any>;
                backgroundRest = set.rest;
                backgroundHover = set.hover;
                backgroundActive = set.active;
                backgroundFocus = set.focus;
                values.push({
                    type: SwatchType.fill,
                    tokenName: set.rest.name,
                    fillRecipe: set.rest,
                });
                values.push({
                    type: SwatchType.fill,
                    tokenName: set.hover.name,
                    fillRecipe: set.hover,
                });
                values.push({
                    type: SwatchType.fill,
                    tokenName: set.active.name,
                    fillRecipe: set.active,
                });
                values.push({
                    type: SwatchType.fill,
                    tokenName: set.focus.name,
                    fillRecipe: set.focus,
                });
            }
        }

        const colorValue = this.styles?.effectiveProperties?.get(StyleProperty.foregroundFill);
        if (colorValue) {
            if (typeof colorValue === "string") {
                // ignore for now
            } else if (colorValue instanceof TypedCSSDesignToken) {
                values.push({
                    type: SwatchType.foreground,
                    tokenName: (colorValue as TypedCSSDesignToken<any>).name,
                    foregroundRecipe: colorValue,
                    fillRecipe: backgroundRest,
                });
            } else {
                const set = colorValue as InteractiveTokenGroup<any>;
                values.push({
                    type: SwatchType.foreground,
                    tokenName: set.rest.name,
                    foregroundRecipe: set.rest,
                    fillRecipe: backgroundRest,
                });
                values.push({
                    type: SwatchType.foreground,
                    tokenName: set.hover.name,
                    foregroundRecipe: set.hover,
                    fillRecipe: backgroundHover,
                });
                values.push({
                    type: SwatchType.foreground,
                    tokenName: set.active.name,
                    foregroundRecipe: set.active,
                    fillRecipe: backgroundActive,
                });
                values.push({
                    type: SwatchType.foreground,
                    tokenName: set.focus.name,
                    foregroundRecipe: set.focus,
                    fillRecipe: backgroundFocus,
                });
            }
        }

        const borderValue = this.styles?.effectiveProperties?.get(StyleProperty.borderFillTop);
        if (borderValue) {
            if (typeof borderValue === "string") {
                // ignore for now
            } else if (borderValue instanceof TypedCSSDesignToken) {
                values.push({
                    type: SwatchType.outline,
                    tokenName: (borderValue as TypedCSSDesignToken<any>).name,
                    outlineRecipe: borderValue,
                    fillRecipe: backgroundRest,
                });
            } else {
                const set = borderValue as InteractiveTokenGroup<any>;
                values.push({
                    type: SwatchType.outline,
                    tokenName: set.rest.name,
                    outlineRecipe: set.rest,
                    fillRecipe: backgroundRest,
                });
                values.push({
                    type: SwatchType.outline,
                    tokenName: set.hover.name,
                    outlineRecipe: set.hover,
                    fillRecipe: backgroundHover,
                });
                values.push({
                    type: SwatchType.outline,
                    tokenName: set.active.name,
                    outlineRecipe: set.active,
                    fillRecipe: backgroundActive,
                });
                values.push({
                    type: SwatchType.outline,
                    tokenName: set.focus.name,
                    outlineRecipe: set.focus,
                    fillRecipe: backgroundFocus,
                });
            }
        }

        return values;
    }
}
