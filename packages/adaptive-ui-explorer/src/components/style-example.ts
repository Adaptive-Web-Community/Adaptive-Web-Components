import { fillColor, InteractiveTokenSet, Styles, Swatch } from "@adaptive-web/adaptive-ui";
import { css, customElement, FASTElement, html, observable, repeat, volatile } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { SwatchType } from "./swatch.js";
import "./adaptive-component.js";
import "./swatch.js";

const template = html<StyleExample>`
    <template>
        <div class="example">
            <app-adaptive-component :styles="${x => x.styles}">
                <slot></slot>
            </app-adaptive-component>
        </div>
        ${repeat(x => x.styleValues, html<StyleValue, StyleExample>`
            <app-swatch
                type="${x => x.type}"
                recipe-name="${x => x.tokenName}"
                :fillRecipe="${x => x.fillRecipe}"
                :foregroundRecipe="${x => x.foregroundRecipe}"
                :outlineRecipe="${x => x.outlineRecipe}"
            ></app-swatch>
        `)}
    </template>
`;

const styles = css`
    :host {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .example {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 24px;
    }
`;

interface StyleValue {
    type: SwatchType;
    tokenName: string;
    foregroundRecipe?: CSSDesignToken<Swatch>;
    fillRecipe?: CSSDesignToken<Swatch>;
    outlineRecipe?: CSSDesignToken<Swatch>;
}

@customElement({
    name: "app-style-example",
    template,
    styles,
})
export class StyleExample extends FASTElement {
    @observable
    public styles?: Styles;
    
    @volatile
    public get styleValues(): StyleValue[] {
        const values: StyleValue[] = [];

        let backgroundRest = fillColor;
        let backgroundHover = fillColor;
        let backgroundActive = fillColor;
        let backgroundFocus = fillColor;

        const backgroundValue = (this.styles || {})["background-color"];
        if (backgroundValue) {
            if (typeof backgroundValue === "string") {
                // ignore for now
            } else if (backgroundValue instanceof CSSDesignToken) {
                backgroundRest = backgroundValue;
                values.push({
                    type: SwatchType.fill,
                    tokenName: (backgroundValue as CSSDesignToken<any>).name,
                    fillRecipe: backgroundValue,
                });
            } else {
                const set = backgroundValue as InteractiveTokenSet<any>;
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

        const colorValue = (this.styles || {})["color"];
        if (colorValue) {
            if (typeof colorValue === "string") {
                // ignore for now
            } else if (colorValue instanceof CSSDesignToken) {
                values.push({
                    type: SwatchType.foreground,
                    tokenName: (colorValue as CSSDesignToken<any>).name,
                    foregroundRecipe: colorValue,
                    fillRecipe: backgroundRest,
                });
            } else {
                const set = colorValue as InteractiveTokenSet<any>;
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

        const borderValue = (this.styles || {})["border-color"];
        if (borderValue) {
            if (typeof borderValue === "string") {
                // ignore for now
            } else if (borderValue instanceof CSSDesignToken) {
                values.push({
                    type: SwatchType.outline,
                    tokenName: (borderValue as CSSDesignToken<any>).name,
                    outlineRecipe: borderValue,
                    fillRecipe: backgroundRest,
                });
            } else {
                const set = borderValue as InteractiveTokenSet<any>;
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
