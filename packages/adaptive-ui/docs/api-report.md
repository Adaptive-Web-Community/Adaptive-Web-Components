## API Report File for "@adaptive-web/adaptive-ui"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AddBehavior } from '@microsoft/fast-element';
import { Color as Color_2 } from 'culori/fn';
import { ComposableStyles } from '@microsoft/fast-element';
import { CSSDesignToken } from '@microsoft/fast-foundation';
import { CSSDirective } from '@microsoft/fast-element';
import { DesignToken } from '@microsoft/fast-foundation';
import { DesignTokenResolver } from '@microsoft/fast-foundation';
import { ElementStyles } from '@microsoft/fast-element';
import { Rgb } from 'culori/fn';
import { TypedCSSDesignToken as TypedCSSDesignToken_2 } from '../adaptive-design-tokens.js';
import { ValuesOf } from '@microsoft/fast-foundation';

// @public
export class BasePalette<T extends Color = Color> implements Palette<T> {
    constructor(source: Color, swatches: ReadonlyArray<T>);
    readonly closestIndexCache: Map<number, number>;
    closestIndexOf(reference: RelativeLuminance): number;
    colorContrast(reference: RelativeLuminance, contrastTarget: number, initialSearchIndex?: number, direction?: PaletteDirection): T;
    delta(reference: RelativeLuminance, delta: number, direction: PaletteDirection): T;
    get(index: number): T;
    readonly lastIndex: number;
    readonly reversedSwatches: ReadonlyArray<T>;
    readonly source: Color;
    readonly swatches: ReadonlyArray<T>;
}

// @internal
export const _black: Color;

// @public
export function blackOrWhiteByContrast(reference: Paint, minContrast: number, defaultBlack: boolean): Color;

// @public
export function blackOrWhiteByContrastSet(set: InteractivePaintSet, minContrast: number, defaultBlack: boolean): InteractiveColorSet;

// @public
export type BooleanCondition = string;

// @public @deprecated (undocumented)
export const BorderFill: {
    all: (value: StyleValue) => StyleProperties;
};

// @public @deprecated (undocumented)
export const BorderStyle: {
    all: (value: StyleValue) => StyleProperties;
};

// @public @deprecated (undocumented)
export const BorderThickness: {
    all: (value: StyleValue) => StyleProperties;
};

// @public
export function calculateOverlayColor(match: Color_2, background: Color_2): Rgb;

// @public
export class Color extends Paint {
    constructor(color: Color_2, intendedColor?: Color);
    static asOverlay(intendedColor: Color, reference: Color): Color;
    readonly color: Color_2;
    createCSS: () => string;
    static from(obj: {
        r: number;
        g: number;
        b: number;
        alpha?: number;
    }): Color;
    static fromRgb(r: number, g: number, b: number, alpha?: number): Color;
    protected readonly _intendedColor?: Color;
    static parse(color: string): Color | undefined;
    // @deprecated
    toColorString: () => string;
    toString(): string;
    static unsafeOpacity(color: Color, alpha: number): Color;
}

// @public
export type ColorRecipe<T = Color> = RecipeOptional<ColorRecipeParams, T>;

// @public
export type ColorRecipeBySet<T = Color> = Recipe<InteractivePaintSet, T>;

// @public
export type ColorRecipeBySetEvaluate<T = Color> = RecipeEvaluate<InteractivePaintSet, T>;

// @public
export type ColorRecipeEvaluate<T = Color> = RecipeEvaluateOptional<ColorRecipeParams, T>;

// @public
export type ColorRecipePalette<T = Color> = Recipe<ColorRecipePaletteParams, T>;

// @public
export type ColorRecipePaletteEvaluate<T = Color> = RecipeEvaluate<ColorRecipePaletteParams, T>;

// @public
export type ColorRecipePaletteParams = ColorRecipeParams & {
    palette: Palette;
};

// @public
export type ColorRecipeParams = {
    reference: Paint | null;
};

// @public
export interface ComponentAnatomy<TConditions extends ComponentConditions, TParts extends ComponentParts> {
    conditions: TConditions;
    context?: string;
    focus?: FocusDefinition<TParts>;
    interactivity?: InteractivityDefinition;
    name?: string;
    parts: TParts;
}

// @public
export type ComponentConditions = Record<string, Condition>;

// @public
export type ComponentParts = Record<string, string>;

// @public
export type Condition = BooleanCondition | StringCondition;

// @public
export function contrast(a: RelativeLuminance, b: RelativeLuminance): number;

// @public
export function contrastAndDeltaSwatchSet(palette: Palette, reference: Paint, minContrast: number, restDelta: number, hoverDelta: number, activeDelta: number, focusDelta: number, disabledDelta: number, disabledPalette?: Palette, direction?: PaletteDirection, zeroAsTransparent?: boolean): InteractiveColorSet;

// @public
export function contrastSwatch(palette: Palette, reference: Paint, minContrast: number, direction?: PaletteDirection): Color;

// @public
export const convertStylesToFocusState: (styles: Styles) => Styles;

// @public @deprecated (undocumented)
export const CornerRadius: {
    all: (value: StyleValue) => StyleProperties;
};

// Warning: (ae-internal-missing-underscore) The name "create" should be prefixed with an underscore because the declaration is marked as @internal
//
// @internal @deprecated (undocumented)
export const create: typeof DesignToken.create;

// @public
export function createForegroundSet(foregroundRecipe: TypedDesignToken<InteractiveColorRecipe>, background: InteractiveTokenGroup<Paint>): InteractiveTokenGroup<Paint>;

// @public
export function createForegroundSetBySet(foregroundRecipe: TypedDesignToken<InteractiveColorRecipeBySet>, background: InteractiveTokenGroup<Paint>): InteractiveTokenGroup<Paint>;

// Warning: (ae-internal-missing-underscore) The name "createNonCss" should be prefixed with an underscore because the declaration is marked as @internal
//
// @internal @deprecated (undocumented)
export function createNonCss<T>(name: string): DesignToken<T>;

// @public
export function createTokenColor(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<Color>;

// @public
export function createTokenColorRecipe<T = Paint>(baseName: string, intendedFor: StyleProperty | StyleProperty[], evaluate: ColorRecipeEvaluate<T>): TypedDesignToken<ColorRecipe<T>>;

// @public
export function createTokenColorRecipeBySet<T = Paint>(baseName: string, intendedFor: StyleProperty | StyleProperty[], evaluate: ColorRecipeBySetEvaluate<T>): TypedDesignToken<ColorRecipeBySet<T>>;

// @public
export function createTokenColorRecipeForPalette<T = Paint>(baseName: string, intendedFor: StyleProperty | StyleProperty[], evaluate: ColorRecipePaletteEvaluate<T>): TypedDesignToken<ColorRecipePalette<T>>;

// @public
export function createTokenColorRecipeValue(recipeToken: TypedDesignToken<ColorRecipe<Paint>>): TypedCSSDesignToken<Paint>;

// @public
export function createTokenColorRecipeWithPalette<T = Paint>(recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>, paletteToken: DesignToken<Palette>): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>>;

// @public
export function createTokenColorSet(recipeToken: TypedDesignToken<InteractiveColorRecipe>): InteractiveTokenGroup<Paint>;

// @public
export function createTokenDelta(baseName: string, state: InteractiveState | string, value: number | DesignToken<number>): TypedDesignToken<number>;

// @public
export function createTokenDimension(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<string>;

// @public
export function createTokenFontFamily(name: string): TypedCSSDesignToken<string>;

// @public
export function createTokenFontSize(name: string): TypedCSSDesignToken<string>;

// @public
export function createTokenFontStyle(name: string): TypedCSSDesignToken<string>;

// @public
export function createTokenFontVariations(name: string): TypedCSSDesignToken<string>;

// @public
export function createTokenFontWeight(name: string): TypedCSSDesignToken<number>;

// @public
export function createTokenLineHeight(name: string): TypedCSSDesignToken<string>;

// @public
export function createTokenMinContrast(baseName: string, value: number | DesignToken<number>): TypedDesignToken<number>;

// @public
export function createTokenNonCss<T>(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]): TypedDesignToken<T>;

// @public
export function createTokenNumber(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<number>;

// @public
export function createTokenNumberNonStyling(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedDesignToken<number>;

// @public
export function createTokenPaint(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<Paint>;

// @public
export function createTokenRecipe<TParam, TResult>(baseName: string, intendedFor: StyleProperty | StyleProperty[], evaluate: RecipeEvaluate<TParam, TResult>): TypedDesignToken<Recipe<TParam, TResult>>;

// @public
export const createTokenShadow: (name: string) => TypedCSSDesignToken_2<ShadowValue>;

// @public @deprecated
export function createTokenSwatch(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<Swatch>;

// @public
export const createTyped: typeof TypedCSSDesignToken.createTyped;

// @public
export function deltaSwatch(palette: Palette, reference: Paint, delta: number, direction?: PaletteDirection): Color;

// @public
export function deltaSwatchSet(palette: Palette, reference: Paint, restDelta: number, hoverDelta: number, activeDelta: number, focusDelta: number, disabledDelta?: number, disabledPalette?: Palette, direction?: PaletteDirection, zeroAsTransparent?: boolean): InteractiveColorSet;

// @public
export const densityAdjustmentUnits: TypedDesignToken<number>;

// @public
export class DensityPaddingAndGapTokenGroup implements TokenGroup {
    constructor(name: string, horizontalPaddingUnits: number, horizontalGapUnits: number, verticalPaddingUnits: number, verticalGapUnits: number, designUnit: string | DesignToken<string>, borderThickness: string | DesignToken<string>);
    readonly borderThickness: TypedCSSDesignToken<string>;
    readonly designUnit: TypedCSSDesignToken<string>;
    readonly horizontalGap: TypedCSSDesignToken<string>;
    readonly horizontalGapUnits: TypedDesignToken<number>;
    readonly horizontalPadding: TypedCSSDesignToken<string>;
    readonly horizontalPaddingUnits: TypedDesignToken<number>;
    // (undocumented)
    readonly name: string;
    get padding(): CSSDirective;
    readonly verticalGap: TypedCSSDesignToken<string>;
    readonly verticalGapUnits: TypedDesignToken<number>;
    readonly verticalPadding: TypedCSSDesignToken<string>;
    readonly verticalPaddingUnits: TypedDesignToken<number>;
}

// @public
export type DesignTokenMetadata = {
    readonly type: DesignTokenType;
    readonly intendedFor?: StyleProperty[];
};

// @public
export class DesignTokenMultiValue<T extends CSSDirective | string> extends Array<T> implements CSSDirective {
    // (undocumented)
    createCSS(): string;
}

// @public
export abstract class DesignTokenRegistry {
    static Groups: Map<string, InteractiveTokenGroup<any>>;
    static Shared: Map<string, DesignToken<any>>;
}

// @public
export const DesignTokenType: {
    readonly color: "color";
    readonly dimension: "dimension";
    readonly fontFamily: "fontFamily";
    readonly fontWeight: "fontWeight";
    readonly duration: "duration";
    readonly cubicBezier: "cubicBezier";
    readonly number: "number";
    readonly strokeStyle: "strokeStyle";
    readonly border: "border";
    readonly transition: "transition";
    readonly shadow: "shadow";
    readonly gradient: "gradient";
    readonly typography: "typography";
    readonly boolean: "boolean";
    readonly fontStyle: "fontStyle";
    readonly fontVariations: "fontVariations";
    readonly palette: "palette";
    readonly recipe: "recipe";
    readonly paint: "paint";
    readonly string: "string";
};

// @public
export type DesignTokenType = ValuesOf<typeof DesignTokenType> | string;

// @public
export function directionByIsDark(color: RelativeLuminance): PaletteDirectionValue;

// @public
export type EffectiveStylePropertiesMap = Map<string, StyleValue>;

// @public
export class ElementStylesRenderer {
    constructor(styles: Styles);
    static disabledStyles: Styles;
    static get focusResetStyles(): Styles;
    static set focusResetStyles(styles: Styles);
    static get focusStateStyles(): Styles;
    static set focusStateStyles(styles: Styles);
    render(target: StyleModuleTarget, interactivity?: InteractivityDefinition): ElementStyles;
    static renderStyleRules(baseStyles: ComposableStyles[] | undefined, styleRules: StyleRules, anatomy?: ComponentAnatomy<any, any>): ElementStyles;
}

// @public
export type ElevationRecipe = Recipe<number, string>;

// @public
export type ElevationRecipeEvaluate = RecipeEvaluate<number, string>;

// @public (undocumented)
export const Fill: {
    backgroundAndForeground: (background: InteractiveTokenGroup<Paint>, foregroundRecipe: TypedDesignToken<InteractiveColorRecipe>) => StyleProperties;
    backgroundAndForegroundBySet: (background: InteractiveTokenGroup<Paint>, foregroundRecipe: TypedDesignToken<InteractiveColorRecipeBySet>) => StyleProperties;
    foregroundNonInteractiveWithDisabled: (foreground: TypedCSSDesignToken<Paint>, disabled: TypedCSSDesignToken<Paint>) => StyleProperties;
};

// @public
export const Focus: {
    readonly contextFocused: () => FocusDefinition<any>;
    readonly contextChildFocused: <TParts>(indicatorPart: keyof TParts & string) => FocusDefinition<TParts>;
    readonly partFocused: <TParts_1>(part: keyof TParts_1 & string) => FocusDefinition<TParts_1>;
    readonly partWithin: <TParts_2>(indicatorPart: keyof TParts_2 & string, focusablePart: keyof TParts_2 & string) => FocusDefinition<TParts_2>;
};

// @public
export interface FocusDefinition<TParts> {
    focusTarget: StyleModuleTarget;
    resetTarget?: StyleModuleTarget;
}

// @public
export function idealColorDeltaSwatchSet(palette: Palette, reference: Paint, minContrast: number, idealColor: Color, restDelta: number, hoverDelta: number, activeDelta: number, focusDelta: number, disabledDelta: number, disabledPalette?: Palette, direction?: PaletteDirection): InteractiveColorSet;

// @public
export type InteractiveColorRecipe = ColorRecipe<InteractivePaintSet>;

// @public
export type InteractiveColorRecipeBySet = ColorRecipeBySet<InteractivePaintSet>;

// @public
export type InteractiveColorRecipeBySetEvaluate = ColorRecipeBySetEvaluate<InteractivePaintSet>;

// @public
export type InteractiveColorRecipeEvaluate = ColorRecipeEvaluate<InteractivePaintSet>;

// @public
export type InteractiveColorRecipePalette = ColorRecipePalette<InteractivePaintSet>;

// @public
export type InteractiveColorRecipePaletteEvaluate = ColorRecipePaletteEvaluate<InteractivePaintSet>;

// @public
export interface InteractiveColorSet extends InteractiveValues<Color | null> {
}

// @public
export interface InteractivePaintSet extends InteractiveValues<Paint | null> {
}

// @public
export enum InteractiveState {
    active = "active",
    disabled = "disabled",
    focus = "focus",
    hover = "hover",
    rest = "rest"
}

// @public
export function interactiveSwatchSetAsOverlay(set: InteractiveColorSet, reference: Color, asOverlay: boolean): InteractiveColorSet;

// @public
export interface InteractiveTokenGroup<T> extends MakePropertyRequired<TokenGroup, "type">, InteractiveValues<TypedCSSDesignToken<T>> {
}

// @public
export type InteractiveValues<T> = {
    [key in InteractiveState]: T;
};

// @public
export const Interactivity: {
    readonly disabledAttribute: InteractivityDefinition;
    readonly disabledClass: InteractivityDefinition;
    readonly hrefAttribute: InteractivityDefinition;
    readonly always: InteractivityDefinition;
    readonly never: InteractivityDefinition;
};

// @public
export type InteractivityDefinition = {
    [key in InteractiveState]?: string;
} & {
    interactive?: string;
};

// @public
export function isDark(color: RelativeLuminance): boolean;

// @public
export function luminanceSwatch(luminance: number): Color;

// @public (undocumented)
export type MakePropertyOptional<T, K extends keyof T> = Omit<T, K> & {
    [P in K]?: T[P];
};

// @public (undocumented)
export type MakePropertyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// @public
export function makeSelector(params: StyleModuleEvaluateParameters, state: InteractiveState): string;

// @public @deprecated (undocumented)
export const Padding: {
    all: (value: StyleValue) => StyleProperties;
    verticalHorizontal: (valueVertical: StyleValue, valueHorizontal: StyleValue) => StyleProperties;
};

// @public
export abstract class Paint implements RelativeLuminance, CSSDirective {
    protected constructor(relativeLuminance: number);
    // (undocumented)
    contrast(b: RelativeLuminance): number;
    createCSS(add: AddBehavior): ComposableStyles;
    get relativeLuminance(): number;
}

// @public
export interface Palette<T extends Color = Color> {
    closestIndexOf(reference: RelativeLuminance): number;
    colorContrast(reference: RelativeLuminance, minContrast: number, initialIndex?: number, direction?: PaletteDirection): T;
    delta(reference: RelativeLuminance, delta: number, direction: PaletteDirection): T;
    get(index: number): T;
    readonly source: Color;
    readonly swatches: ReadonlyArray<T>;
}

// @public
export type PaletteDirection = PaletteDirectionValue | (() => PaletteDirectionValue);

// @public
export const PaletteDirectionValue: Readonly<{
    readonly darker: 1;
    readonly lighter: -1;
}>;

// @public
export type PaletteDirectionValue = typeof PaletteDirectionValue[keyof typeof PaletteDirectionValue];

// @public
export class PaletteOkhsl extends BasePalette {
    // (undocumented)
    static from(source: Color | string, options?: Partial<PaletteOkhslOptions>): PaletteOkhsl;
}

// @public
export interface PaletteOkhslOptions {
    darkEndSaturation: number;
    lightEndSaturation: number;
    stepCount: number;
}

// @public
export class PaletteRGB extends BasePalette {
    static from(source: Color | string, options?: Partial<PaletteRGBOptions>): PaletteRGB;
}

// @public
export interface PaletteRGBOptions {
    preserveSource: boolean;
    stepContrast: number;
    stepContrastRamp: number;
}

// @public
export interface Recipe<TParam, TResult> {
    evaluate: RecipeEvaluate<TParam, TResult>;
}

// @public (undocumented)
export type RecipeEvaluate<TParam, TResult> = (resolver: DesignTokenResolver, params: TParam) => TResult;

// @public (undocumented)
export type RecipeEvaluateOptional<TParam, TResult> = (resolver: DesignTokenResolver, params?: TParam) => TResult;

// @public
export interface RecipeOptional<TParam, TResult> {
    evaluate: RecipeEvaluateOptional<TParam, TResult>;
}

// @public
export interface RelativeLuminance {
    contrast: (a: RelativeLuminance) => number;
    readonly relativeLuminance: number;
}

// @public
export function resolvePaletteDirection(direction: PaletteDirection): PaletteDirectionValue;

// @beta (undocumented)
export interface SerializableAnatomy {
    // (undocumented)
    conditions: Record<string, SerializableCondition>;
    // (undocumented)
    context: string;
    // (undocumented)
    focus?: FocusDefinition<any>;
    // (undocumented)
    interactivity?: InteractivityDefinition;
    // (undocumented)
    name: string;
    // (undocumented)
    parts: Record<string, string>;
    // (undocumented)
    styleRules: SerializableStyleRule[];
}

// @beta (undocumented)
export interface SerializableAnatomyWithImports extends SerializableAnatomy {
    // (undocumented)
    imports?: string[];
}

// @beta (undocumented)
export type SerializableBooleanCondition = string;

// @beta (undocumented)
export type SerializableCondition = SerializableBooleanCondition | SerializableStringCondition;

// @beta (undocumented)
export type SerializableStringCondition = Record<string, string>;

// @beta (undocumented)
export interface SerializableStyleRule {
    // (undocumented)
    contextCondition?: Record<string, string | boolean>;
    // (undocumented)
    part?: string;
    // (undocumented)
    properties?: Record<string, string>;
    // (undocumented)
    styles?: string[];
}

// @public
export class Shadow implements CSSDirective {
    constructor(color: Color, xOffset: number, yOffset: number, blurRadius?: number | undefined, spread?: number | undefined);
    // (undocumented)
    blurRadius?: number | undefined;
    // (undocumented)
    color: Color;
    // (undocumented)
    createCSS(): string;
    // (undocumented)
    spread?: number | undefined;
    // (undocumented)
    xOffset: number;
    // (undocumented)
    yOffset: number;
}

// @public
export type ShadowValue = Shadow | DesignTokenMultiValue<Shadow> | string;

// @public
export type StringCondition = Record<string, string>;

// @public
export type StyleDeclaration = {
    styles?: Styles | Iterable<Styles>;
    properties?: StyleProperties;
};

// @public
export type StyleKey = StyleProperty | StylePropertyShorthand | (string & Record<never, never>);

// @public
export type StyleModuleEvaluateParameters = StyleModuleTarget & InteractivityDefinition;

// @public
export interface StyleModuleTarget {
    context?: string;
    contextCondition?: string;
    // @beta
    ignoreInteractivity?: boolean;
    part?: string;
    partCondition?: string;
    stateOnContext?: boolean;
}

// @public
export type StyleProperties = Partial<Record<StyleKey, StyleValue>>;

// @public
export type StylePropertiesMap = Map<StyleKey, StyleValue>;

// @public
export const StyleProperty: {
    readonly backgroundFill: "backgroundFill";
    readonly foregroundFill: "foregroundFill";
    readonly borderFillTop: "borderFillTop";
    readonly borderFillRight: "borderFillRight";
    readonly borderFillBottom: "borderFillBottom";
    readonly borderFillLeft: "borderFillLeft";
    readonly borderThicknessTop: "borderThicknessTop";
    readonly borderThicknessRight: "borderThicknessRight";
    readonly borderThicknessBottom: "borderThicknessBottom";
    readonly borderThicknessLeft: "borderThicknessLeft";
    readonly borderStyleTop: "borderStyleTop";
    readonly borderStyleRight: "borderStyleRight";
    readonly borderStyleBottom: "borderStyleBottom";
    readonly borderStyleLeft: "borderStyleLeft";
    readonly cornerRadiusTopLeft: "cornerRadiusTopLeft";
    readonly cornerRadiusTopRight: "cornerRadiusTopRight";
    readonly cornerRadiusBottomRight: "cornerRadiusBottomRight";
    readonly cornerRadiusBottomLeft: "cornerRadiusBottomLeft";
    readonly fontFamily: "fontFamily";
    readonly fontSize: "fontSize";
    readonly fontWeight: "fontWeight";
    readonly fontStyle: "fontStyle";
    readonly fontVariationSettings: "fontVariationSettings";
    readonly letterSpacing: "letterSpacing";
    readonly lineHeight: "lineHeight";
    readonly marginTop: "marginTop";
    readonly marginRight: "marginRight";
    readonly marginBottom: "marginBottom";
    readonly marginLeft: "marginLeft";
    readonly paddingTop: "paddingTop";
    readonly paddingRight: "paddingRight";
    readonly paddingBottom: "paddingBottom";
    readonly paddingLeft: "paddingLeft";
    readonly gap: "gap";
    readonly height: "height";
    readonly minHeight: "minHeight";
    readonly maxHeight: "maxHeight";
    readonly width: "width";
    readonly minWidth: "minWidth";
    readonly maxWidth: "maxWidth";
    readonly layoutInner: "layoutInner";
    readonly layoutDirection: "layoutDirection";
    readonly layoutMainAxisAlignItems: "layoutMainAxisAlignItems";
    readonly layoutCrossAxisAlignItems: "layoutCrossAxisAlignItems";
    readonly layoutWrap: "layoutWrap";
    readonly opacity: "opacity";
    readonly cursor: "cursor";
    readonly outlineColor: "outlineColor";
    readonly outlineOffset: "outlineOffset";
    readonly outlineStyle: "outlineStyle";
    readonly outlineThickness: "outlineThickness";
    readonly outlineWidth: "outlineWidth";
    readonly shadow: "shadow";
};

// @public
export type StyleProperty = ValuesOf<typeof StyleProperty>;

// @public @deprecated
export const stylePropertyBorderFillAll: ("borderFillTop" | "borderFillRight" | "borderFillBottom" | "borderFillLeft")[];

// @public @deprecated
export const stylePropertyBorderStyleAll: ("borderStyleTop" | "borderStyleRight" | "borderStyleBottom" | "borderStyleLeft")[];

// @public @deprecated
export const stylePropertyBorderThicknessAll: ("borderThicknessTop" | "borderThicknessRight" | "borderThicknessBottom" | "borderThicknessLeft")[];

// @public @deprecated
export const stylePropertyCornerRadiusAll: ("cornerRadiusTopLeft" | "cornerRadiusTopRight" | "cornerRadiusBottomRight" | "cornerRadiusBottomLeft")[];

// @public @deprecated
export type StylePropertyCss = StyleProperty | (string & Record<never, never>);

// @public @deprecated
export const stylePropertyPaddingAll: ("paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft")[];

// @public (undocumented)
export const StylePropertyShorthand: {
    borderFill: ("borderFillTop" | "borderFillRight" | "borderFillBottom" | "borderFillLeft")[];
    borderThickness: ("borderThicknessTop" | "borderThicknessRight" | "borderThicknessBottom" | "borderThicknessLeft")[];
    borderStyle: ("borderStyleTop" | "borderStyleRight" | "borderStyleBottom" | "borderStyleLeft")[];
    cornerRadius: ("cornerRadiusTopLeft" | "cornerRadiusTopRight" | "cornerRadiusBottomRight" | "cornerRadiusBottomLeft")[];
    margin: ("marginTop" | "marginRight" | "marginBottom" | "marginLeft")[];
    marginHorizontal: ("marginRight" | "marginLeft")[];
    marginVertical: ("marginTop" | "marginBottom")[];
    padding: ("paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft")[];
    paddingHorizontal: ("paddingRight" | "paddingLeft")[];
    paddingVertical: ("paddingTop" | "paddingBottom")[];
};

// @public
export type StylePropertyShorthand = keyof typeof StylePropertyShorthand;

// @public
export type StyleRule = {
    target?: StyleModuleTarget;
} & StyleDeclaration;

// @public
export type StyleRules = Array<StyleRule>;

// @public
export class Styles {
    // (undocumented)
    appendComposed(styles: Styles): void;
    clearComposed(): void;
    static compose(styles: Styles[], properties?: StyleProperties, name?: string): Styles;
    get composed(): Styles[] | undefined;
    get effectiveAdaptiveProperties(): Map<StyleProperty, StyleValue>;
    get effectiveProperties(): EffectiveStylePropertiesMap;
    static fromDeclaration(declaration: StyleDeclaration, name?: string): Styles;
    static fromProperties(properties: StyleProperties, name?: string): Styles;
    readonly name: string | undefined;
    get properties(): Readonly<StylePropertiesMap> | undefined;
    set properties(properties: StylePropertiesMap | undefined);
    // (undocumented)
    static Shared: Map<string, Styles>;
}

// @public
export type StyleValue = CSSDesignToken<any> | InteractiveValues<any | null> | CSSDirective | string | number;

// @public @deprecated
export class Swatch extends Color {
    static asOverlay(intendedColor: Swatch, reference: Swatch): Swatch;
    static from(obj: {
        r: number;
        g: number;
        b: number;
        alpha?: number;
    }): Swatch;
    static fromColor(color: Color): Swatch;
    static fromRgb(r: number, g: number, b: number, alpha?: number): Swatch;
    static parse(color: string): Swatch | undefined;
    // @deprecated
    toTransparent(alpha?: number): Swatch;
}

// @public
export function swatchAsOverlay(color: Color | null, reference: Color, asOverlay: boolean): Color | null;

// @public
export interface TokenGroup extends MakePropertyOptional<DesignTokenMetadata, "type"> {
    intendedFor?: StyleProperty[];
    name: string;
    type?: DesignTokenType;
}

// Warning: (ae-different-release-tags) This symbol has another declaration with a different release tag
// Warning: (ae-internal-mixed-release-tag) Mixed release tags are not allowed for "TypedCSSDesignToken" because one of its declarations is marked as @internal
//
// @public
export class TypedCSSDesignToken<T> extends CSSDesignToken<T> implements DesignTokenMetadata {
    constructor(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]);
    static createTyped<T>(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<T>;
}

// @internal (undocumented)
export interface TypedCSSDesignToken<T> extends DesignTokenMetadata {
}

// Warning: (ae-different-release-tags) This symbol has another declaration with a different release tag
// Warning: (ae-internal-mixed-release-tag) Mixed release tags are not allowed for "TypedDesignToken" because one of its declarations is marked as @internal
//
// @public
export class TypedDesignToken<T> extends DesignToken<T> implements DesignTokenMetadata {
    constructor(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]);
    static createTyped<T>(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]): TypedDesignToken<T>;
}

// @internal (undocumented)
export interface TypedDesignToken<T> extends DesignTokenMetadata {
}

// @internal
export const _white: Color;

// (No @packageDocumentation comment for this package)

```
