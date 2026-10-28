import { DesignToken, Library, recipes, refs } from "design-token-library";
import { Color } from "../core/color/color.js";
import { blackOrWhiteByContrastSet } from "../core/color/recipes/black-or-white-by-contrast-set.js";
import { blackOrWhiteByContrast } from "../core/color/recipes/black-or-white-by-contrast.js";
import { contrastAndDeltaColorSet } from "../core/color/recipes/contrast-and-delta-color-set.js";
import { contrastColor } from "../core/color/recipes/contrast-color.js";
import { deltaColorSet } from "../core/color/recipes/delta-color-set.js";
import { idealColorDeltaSet } from "../core/color/recipes/ideal-color-delta-set.js";
import { InteractivePaintSet } from "../core/color/interactive-set.js";
import { Palette } from "../core/color/palette.js";
import { conditionalColorSet } from "../core/color/utilities/conditional.js";
import { colorSetAsOverlay } from "../core/color/utilities/opacity.js";
import { InteractiveSet, InteractiveState, mapStates } from "../core/interactive.js";
import { StyleProperty, StylePropertyShorthand } from "../core/styles/properties.js";
import { intendedFor } from "../core/token-metadata.js";
import {
    AdaptiveDesignToken,
    BooleanToken,
    ContrastRatioToken,
    DeltaToken,
    interactiveDeltas,
    InteractiveDeltaTokens,
    InteractiveToken,
    PaletteToken,
    WcagContrastLevel,
    WcagContrastLevelToken,
} from "../core/token-types.js";
import { colorContext, ColorContextTokens } from "./color-context.js";
import { layer, LayerTokens } from "./layer.js";
import { ColorPaletteTokens, palettes, PaletteTokens } from "./palette.js";

/**
 * The minimum contrasts of the recipes, which follow the WCAG level.
 *
 * @public
 */
export interface WcagContrastTokens {
    /**
     * The WCAG level that the minimum contrasts follow, `aa` until it is set.
     */
    level: WcagContrastLevelToken;
    minContrast: {
        safety: ContrastRatioToken;
        subtle: ContrastRatioToken;
        ideal: ContrastRatioToken;
        discernible: ContrastRatioToken;
        readable: ContrastRatioToken;
        /**
         * The contrast of the strong strokes, which doesn't depend on the level.
         */
        strong: ContrastRatioToken;
    };
}

/**
 * What the disabled state of the color sets is made from.
 *
 * @remarks
 * The disabled values are fixed here, in the tokens, and are not a part of each recipe: the deltas of a recipe have the disabled delta of
 * a fill or of a stroke as the alias of their own, until it is set.
 *
 * @public
 */
export interface DisabledTokens {
    /**
     * The palette of the disabled colors, which is the palette of the layers until it is set, so a disabled color blends into its background.
     */
    palette: PaletteToken;
    /**
     * The steps from the color context of the fills, in the disabled palette.
     */
    fillDelta: DeltaToken;
    /**
     * The steps from the color context of the strokes, in the disabled palette.
     */
    strokeDelta: DeltaToken;
}

/**
 * The deltas that the fills read, which are shared by all the palettes. A group is a number of palette steps for each state.
 *
 * @public
 */
export interface FillDeltaTokens {
    stealth: InteractiveDeltaTokens;
    subtle: InteractiveDeltaTokens;
    ideal: InteractiveDeltaTokens;
    discernible: InteractiveDeltaTokens;
    readable: InteractiveDeltaTokens;
}

/**
 * The deltas that the strokes read, which are shared by all the palettes. A group is a number of palette steps for each state.
 *
 * @public
 */
export interface StrokeDeltaTokens {
    safety: InteractiveDeltaTokens;
    stealth: InteractiveDeltaTokens;
    subtle: InteractiveDeltaTokens;
    discernible: InteractiveDeltaTokens;
    readable: InteractiveDeltaTokens;
    strong: InteractiveDeltaTokens;
}

/**
 * The deltas of the color sets, under `color`.
 *
 * @remarks
 * `subtleInverse` reads the deltas of `subtle` in the other direction and has no deltas of its own.
 *
 * @public
 */
export interface ColorDeltaTokens {
    fill: FillDeltaTokens;
    stroke: StrokeDeltaTokens;
}

/**
 * The fills of a palette. Each is an interactive token, a color for each state, made once, relative to the color context.
 *
 * @public
 */
export interface FillSetTokens {
    /** No color at rest, a subtle color on hover or active. */
    stealth: InteractiveToken<Color>;
    /** A subtle color at rest. */
    subtle: InteractiveToken<Color>;
    /** The `subtle` set in the other direction. */
    subtleInverse: InteractiveToken<Color>;
    /** The ideal color of the palette, if it has the contrast. */
    ideal: InteractiveToken<Color>;
    discernible: InteractiveToken<Color>;
    readable: InteractiveToken<Color>;
}

/**
 * The strokes of a palette. Each is an interactive token, a color for each state, made once, relative to the color context.
 *
 * @public
 */
export interface StrokeSetTokens {
    /** Transparent, until the level has a contrast for it. */
    safety: InteractiveToken<Color>;
    stealth: InteractiveToken<Color>;
    subtle: InteractiveToken<Color>;
    discernible: InteractiveToken<Color>;
    readable: InteractiveToken<Color>;
    strong: InteractiveToken<Color>;
}

/**
 * The color sets of a palette.
 *
 * @public
 */
export interface ColorSetTokens {
    fill: FillSetTokens;
    stroke: StrokeSetTokens;
}

/**
 * A palette of the system, with the base color it is made from and the color sets made from it.
 *
 * @public
 */
export interface ColorFamilyTokens extends ColorPaletteTokens, ColorSetTokens {}

/**
 * The tokens of the focus stroke.
 *
 * @public
 */
export interface FocusStrokeTokens {
    /**
     * The focus stroke, the color of the palette that has the minimum contrast from the color context.
     */
    $root: DesignToken.Color;
    /**
     * The palette of the focus stroke, which is the accent palette until it is set.
     */
    palette: PaletteToken;
    /**
     * The minimum contrast of the focus stroke, which is the discernible minimum contrast until it is set.
     */
    minContrast: ContrastRatioToken;
    /**
     * The outer color of a focus stroke that has two, black or white for the readable contrast with the color context.
     */
    outer: DesignToken.Color;
    /**
     * The inner color of a focus stroke that has two, black or white for the readable contrast with the `outer` color.
     */
    inner: DesignToken.Color;
}

/**
 * The tokens of the colors, under `color`: the palettes, the color context, the layers, and the sets made from them.
 *
 * @public
 */
export interface ColorTokens extends PaletteTokens, ColorContextTokens {
    layer: LayerTokens;
    wcagContrast: WcagContrastTokens;
    disabled: DisabledTokens;
    deltas: ColorDeltaTokens;
    neutral: ColorFamilyTokens & {
        /**
         * Make the neutral sets semitransparent over the color context, so they look the same and the color context shows through.
         */
        asOverlay: BooleanToken;
    };
    accent: ColorFamilyTokens;
    highlight: ColorFamilyTokens;
    critical: ColorFamilyTokens;
    warning: ColorFamilyTokens;
    success: ColorFamilyTokens;
    info: ColorFamilyTokens;
    focusStroke: FocusStrokeTokens;
}

/**
 * The tokens of a library that has the colors.
 *
 * @public
 */
export interface ColorLibraryTokens {
    color: ColorTokens;
}

/**
 * What the color sets of a palette read, which a system that adds a palette of its own has as well.
 *
 * @public
 */
export interface ColorSetLibraryTokens {
    color: Pick<ColorTokens, "context" | "wcagContrast" | "disabled" | "deltas">;
}

/**
 * The recipes of the colors: the functions that make a color or a set of colors, and what they are given from the values of tokens.
 *
 * @remarks
 * Each is a function of values, given refs to the tokens that it reads, and a system changes how every token that uses one is made with
 * `override()` when it extends a library. `inverseDeltas` are the deltas of a set in the other direction (a disabled color is not an inversion
 * of anything, so it is the same), `paletteSource` is the color a palette is made from, `isPositive` is a number above zero, and
 * `minContrastFor` is the minimum contrast of a level, what it is for AA and what for AAA.
 *
 * @public
 */
export const colorRecipes = recipes({
    deltaColorSet,
    contrastAndDeltaColorSet,
    idealColorDeltaSet,
    contrastColor,
    blackOrWhiteByContrast,
    blackOrWhiteByContrastSet,
    colorSetAsOverlay,
    conditionalColorSet,
    inverseDeltas: (deltas: InteractiveSet<number>): InteractiveSet<number> =>
        mapStates(deltas, (delta, state) => (state === InteractiveState.disabled ? delta : -delta)),
    paletteSource: (palette: Palette): Color => palette.source,
    isPositive: (value: number): boolean => value > 0,
    minContrastFor: (level: WcagContrastLevel, aa: number, aaa: number): number => (level === WcagContrastLevel.aa ? aa : aaa),
});

// The refs of what the sets of any palette read, which every library with the sets has.
const shared = refs<ColorSetLibraryTokens>().color;

/**
 * The options of the color sets of a palette.
 *
 * @public
 */
export interface ColorSetsOptions<Root extends ColorSetLibraryTokens> {
    /**
     * The palette that the sets are made from, a ref to a palette token.
     */
    palette: Library.Ref<Palette, Library.TokenValues<Root>>;
    /**
     * If the sets are semitransparent over the color context, a ref to a boolean token. They are not if it is not given.
     */
    asOverlay?: Library.Ref<boolean, Library.TokenValues<Root>>;
}

/**
 * Creates the color sets of a palette: the fills and the strokes, for each of the recipes, in the color context.
 *
 * @remarks
 * It gives the config of the sets, to spread into the group of the palette in the `color` group of a library, so a system adds the sets of a
 * palette of its own the way the default palettes have them. The sets don't need to know where they are: what they read is the palette, which
 * is given, and the shared tokens that are always at the same place, the deltas, the disabled values, and the minimum contrasts.
 *
 * ```ts
 * const tokens = refs<Tokens>();
 * brand: {
 *     palette: { $type: AdaptiveDesignToken.palette, $value: paletteRecipes.paletteFrom(tokens.brand.primary, tokens.color.paletteOptions.stepSize) },
 *     ...createColorSets<Tokens>({ palette: tokens.color.brand.palette }),
 * },
 * ```
 *
 * @param options - The palette, and if the sets are an overlay
 * @returns The config of the `fill` and `stroke` sets
 *
 * @public
 */
export function createColorSets<Root extends ColorSetLibraryTokens>(options: ColorSetsOptions<Root>): Library.Config<ColorSetTokens, Root> {
    const { palette, asOverlay } = options;
    const { context, deltas, wcagContrast } = shared;
    const { minContrast } = wcagContrast;
    const disabledPalette = shared.disabled.palette;
    type Deltas = Library.Refs<InteractiveDeltaTokens, ColorSetLibraryTokens>;
    type Made = ReturnType<typeof colorRecipes.deltaColorSet<Library.TokenValues<Root>>>;

    // A set is made once for the state of all its values, from the inputs that every one of them reads.
    const set = (properties: StyleProperty[], made: Made): Library.ConfigValue<InteractiveToken<Color>, Root> => ({
        $type: AdaptiveDesignToken.interactive,
        $value: asOverlay ? colorRecipes.colorSetAsOverlay(made, context, asOverlay) : made,
        $extensions: intendedFor(...properties),
    });

    const byDelta = (group: Deltas, zeroAsTransparent = false) =>
        colorRecipes.deltaColorSet(palette, context, interactiveDeltas(group), { disabledPalette, zeroAsTransparent });

    const byIdeal = (min: Library.Ref<number, Library.TokenValues<ColorSetLibraryTokens>>, group: Deltas) =>
        colorRecipes.idealColorDeltaSet(palette, context, min, colorRecipes.paletteSource(palette), interactiveDeltas(group), { disabledPalette });

    const byContrast = (min: Library.Ref<number, Library.TokenValues<ColorSetLibraryTokens>>, group: Deltas, zeroAsTransparent = false) =>
        colorRecipes.contrastAndDeltaColorSet(palette, context, min, interactiveDeltas(group), { disabledPalette, zeroAsTransparent });

    const fill = [StyleProperty.backgroundFill];
    const stroke = [...StylePropertyShorthand.borderFill];
    const strokeOrForeground = [...StylePropertyShorthand.borderFill, StyleProperty.foregroundFill];

    return {
        fill: {
            stealth: set(fill, byDelta(deltas.fill.stealth, true)),
            subtle: set(fill, byDelta(deltas.fill.subtle)),
            subtleInverse: set(
                fill,
                colorRecipes.deltaColorSet(palette, context, colorRecipes.inverseDeltas(interactiveDeltas(deltas.fill.subtle)), { disabledPalette })
            ),
            ideal: set(fill, byIdeal(minContrast.ideal, deltas.fill.ideal)),
            discernible: set(fill, byIdeal(minContrast.discernible, deltas.fill.discernible)),
            readable: set(fill, byIdeal(minContrast.readable, deltas.fill.readable)),
        },
        stroke: {
            safety: set(
                stroke,
                colorRecipes.conditionalColorSet(byContrast(minContrast.safety, deltas.stroke.safety), colorRecipes.isPositive(minContrast.safety))
            ),
            stealth: set(stroke, byContrast(minContrast.safety, deltas.stroke.stealth, true)),
            subtle: set(stroke, byContrast(minContrast.subtle, deltas.stroke.subtle)),
            discernible: set(strokeOrForeground, byContrast(minContrast.discernible, deltas.stroke.discernible)),
            readable: set(strokeOrForeground, byContrast(minContrast.readable, deltas.stroke.readable)),
            strong: set(strokeOrForeground, byContrast(minContrast.strong, deltas.stroke.strong)),
        },
    };
}

/**
 * The config of a foreground that is black or white for each state of a background, for a token.
 *
 * @remarks
 * A foreground is made for a background, so there is one for each background a system pairs it with, the way a style module pairs them. It is
 * an interactive token that follows the background: a change to the background is a change to the foreground.
 *
 * @example
 * ```ts
 * foreground: blackOrWhiteReadable(tokens.color.accent.fill.readable),
 * ```
 *
 * @param background - The background, usually a ref to an interactive token
 * @param minContrast - The minimum contrast of the foreground from each state of the background, usually a ref to a contrast ratio token
 * @param defaultBlack - True to be black when both black and white have the contrast
 *
 * @public
 */
export function blackOrWhiteFor<Root extends ColorSetLibraryTokens>(
    background: Library.DeepValue<InteractivePaintSet, Library.TokenValues<Root>>,
    minContrast: Library.DeepValue<number, Library.TokenValues<Root>>,
    defaultBlack = false
): Library.ConfigValue<InteractiveToken<Color>, Root> {
    return {
        $type: AdaptiveDesignToken.interactive,
        $value: colorRecipes.blackOrWhiteByContrastSet(background, minContrast, defaultBlack),
        $extensions: intendedFor(StyleProperty.foregroundFill),
    };
}

/**
 * The config of a foreground that is black or white for a background, with the contrast that is discernible. It is for something that isn't
 * text, like a checked checkbox.
 *
 * @param background - The background, usually a ref to an interactive token
 *
 * @public
 */
export function blackOrWhiteDiscernible<Root extends ColorSetLibraryTokens>(
    background: Library.DeepValue<InteractivePaintSet, Library.TokenValues<Root>>
): Library.ConfigValue<InteractiveToken<Color>, Root> {
    return blackOrWhiteFor<Root>(background, shared.wcagContrast.minContrast.discernible);
}

/**
 * The config of a foreground that is black or white for a background, with the contrast that is readable. It is for text, like the label of a
 * button.
 *
 * @param background - The background, usually a ref to an interactive token
 *
 * @public
 */
export function blackOrWhiteReadable<Root extends ColorSetLibraryTokens>(
    background: Library.DeepValue<InteractivePaintSet, Library.TokenValues<Root>>
): Library.ConfigValue<InteractiveToken<Color>, Root> {
    return blackOrWhiteFor<Root>(background, shared.wcagContrast.minContrast.readable);
}

const tokens = refs<ColorLibraryTokens>().color;

const minContrastFor = (aa: number, aaa: number): Library.ConfigValue<ContrastRatioToken, ColorLibraryTokens> => ({
    $type: AdaptiveDesignToken.contrastRatio,
    $value: colorRecipes.minContrastFor(tokens.wcagContrast.level, aa, aaa),
});

const wcagContrast: Library.Config<WcagContrastTokens, ColorLibraryTokens> = {
    level: { $type: AdaptiveDesignToken.wcagContrastLevel, $value: WcagContrastLevel.aa },
    minContrast: {
        safety: minContrastFor(0, 3),
        subtle: minContrastFor(1.5, 3),
        ideal: minContrastFor(2, 3),
        discernible: minContrastFor(3, 4.5),
        readable: minContrastFor(4.5, 7),
        strong: { $type: AdaptiveDesignToken.contrastRatio, $value: 12 },
    },
};

const disabled: Library.Config<DisabledTokens, ColorLibraryTokens> = {
    palette: { $type: AdaptiveDesignToken.palette, $value: tokens.layer.palette },
    fillDelta: { $type: AdaptiveDesignToken.delta, $value: 3 },
    strokeDelta: { $type: AdaptiveDesignToken.delta, $value: 8 },
};

// The deltas of a recipe, a number of steps for the rest, the hover, and the active. The focus is the rest until it is set, and the
// disabled is the shared one of the fills or of the strokes, or a number of its own: a recipe with no color at rest has none disabled.
// The group is given, since a token can't refer to the tokens next to it without its path, so its focus can refer to its rest.
const deltas = (
    group: Library.Refs<InteractiveDeltaTokens, ColorLibraryTokens>,
    steps: { rest: number; hover: number; active: number },
    disabledDelta: "fill" | "stroke" | number
): Library.Config<InteractiveDeltaTokens, ColorLibraryTokens> => ({
    $type: AdaptiveDesignToken.delta,
    rest: { $value: steps.rest },
    hover: { $value: steps.hover },
    active: { $value: steps.active },
    focus: { $value: group.rest },
    disabled: {
        $value: disabledDelta === "fill" ? tokens.disabled.fillDelta : disabledDelta === "stroke" ? tokens.disabled.strokeDelta : disabledDelta,
    },
});

const colorDeltas: Library.Config<ColorDeltaTokens, ColorLibraryTokens> = {
    fill: {
        stealth: deltas(tokens.deltas.fill.stealth, { rest: 0, hover: 3, active: 2 }, 0),
        subtle: deltas(tokens.deltas.fill.subtle, { rest: 3, hover: 4, active: 2 }, "fill"),
        ideal: deltas(tokens.deltas.fill.ideal, { rest: 0, hover: -2, active: 2 }, "fill"),
        discernible: deltas(tokens.deltas.fill.discernible, { rest: 0, hover: 6, active: 3 }, "fill"),
        readable: deltas(tokens.deltas.fill.readable, { rest: 0, hover: -2, active: 2 }, "fill"),
    },
    stroke: {
        safety: deltas(tokens.deltas.stroke.safety, { rest: 0, hover: 6, active: -6 }, 0),
        stealth: deltas(tokens.deltas.stroke.stealth, { rest: 0, hover: 6, active: -6 }, 0),
        subtle: deltas(tokens.deltas.stroke.subtle, { rest: 0, hover: 4, active: -2 }, "stroke"),
        discernible: deltas(tokens.deltas.stroke.discernible, { rest: 0, hover: 8, active: -4 }, "stroke"),
        readable: deltas(tokens.deltas.stroke.readable, { rest: 0, hover: 6, active: -6 }, "stroke"),
        strong: deltas(tokens.deltas.stroke.strong, { rest: 0, hover: 10, active: -10 }, "stroke"),
    },
};

const focusStroke: Library.Config<FocusStrokeTokens, ColorLibraryTokens> = {
    $root: {
        $type: DesignToken.Type.Color,
        $value: colorRecipes.contrastColor(tokens.focusStroke.palette, tokens.context, tokens.focusStroke.minContrast),
        $extensions: intendedFor(...StylePropertyShorthand.borderFill, StyleProperty.outlineColor),
    },
    palette: { $type: AdaptiveDesignToken.palette, $value: tokens.accent.palette },
    minContrast: { $type: AdaptiveDesignToken.contrastRatio, $value: tokens.wcagContrast.minContrast.discernible },
    outer: {
        $type: DesignToken.Type.Color,
        $value: colorRecipes.blackOrWhiteByContrast(tokens.context, tokens.wcagContrast.minContrast.readable, true),
        $extensions: intendedFor(...StylePropertyShorthand.borderFill),
    },
    inner: {
        $type: DesignToken.Type.Color,
        $value: colorRecipes.blackOrWhiteByContrast(tokens.focusStroke.outer, tokens.wcagContrast.minContrast.readable, false),
        $extensions: intendedFor(...StylePropertyShorthand.borderFill),
    },
};

// The sets of a palette of the system, which is where the palette token of the library is.
const setsOf = (palette: ColorSetsOptions<ColorLibraryTokens>["palette"]) => createColorSets<ColorLibraryTokens>({ palette });

/**
 * The configuration of the color tokens, for the library: the palettes, the color context, the layers, and the sets made from them.
 *
 * @public
 */
export const color: Library.Config<ColorTokens, ColorLibraryTokens> = {
    ...palettes,
    ...colorContext,
    layer,
    wcagContrast,
    disabled,
    deltas: colorDeltas,
    neutral: {
        ...palettes.neutral,
        ...createColorSets<ColorLibraryTokens>({ palette: tokens.neutral.palette, asOverlay: tokens.neutral.asOverlay }),
        asOverlay: { $type: AdaptiveDesignToken.boolean, $value: false },
    },
    accent: { ...palettes.accent, ...setsOf(tokens.accent.palette) },
    highlight: { ...palettes.highlight, ...setsOf(tokens.highlight.palette) },
    critical: { ...palettes.critical, ...setsOf(tokens.critical.palette) },
    warning: { ...palettes.warning, ...setsOf(tokens.warning.palette) },
    success: { ...palettes.success, ...setsOf(tokens.success.palette) },
    info: { ...palettes.info, ...setsOf(tokens.info.palette) },
    focusStroke,
};

/**
 * Creates a library with the color tokens.
 *
 * @public
 */
export const createColorLibrary = () => Library.create<ColorLibraryTokens>({ color });
