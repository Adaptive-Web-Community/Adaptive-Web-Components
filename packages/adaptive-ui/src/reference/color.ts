import { DesignToken, Library } from "design-token-library";
import { Color } from "../core/color/color.js";
import { blackOrWhiteByContrastSet } from "../core/color/recipes/black-or-white-by-contrast-set.js";
import { blackOrWhiteByContrast } from "../core/color/recipes/black-or-white-by-contrast.js";
import { contrastAndDeltaColorSet } from "../core/color/recipes/contrast-and-delta-color-set.js";
import { contrastColor } from "../core/color/recipes/contrast-color.js";
import { deltaColorSet } from "../core/color/recipes/delta-color-set.js";
import { idealColorDeltaSet } from "../core/color/recipes/ideal-color-delta-set.js";
import { InteractiveColorSet, InteractivePaintSet } from "../core/color/interactive-set.js";
import { Palette } from "../core/color/palette.js";
import { conditionalColorSet } from "../core/color/utilities/conditional.js";
import { colorSetAsOverlay } from "../core/color/utilities/opacity.js";
import { InteractiveSet, InteractiveState, mapStates } from "../core/interactive.js";
import { StyleProperty, StylePropertyShorthand } from "../core/modules/types.js";
import { intendedFor } from "../core/token-metadata.js";
import {
    AdaptiveDesignToken,
    BooleanToken,
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
        safety: DesignToken.Number;
        subtle: DesignToken.Number;
        ideal: DesignToken.Number;
        discernible: DesignToken.Number;
        readable: DesignToken.Number;
        /**
         * The contrast of the strong strokes, which doesn't depend on the level.
         */
        strong: DesignToken.Number;
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
    fillDelta: DesignToken.Number;
    /**
     * The steps from the color context of the strokes, in the disabled palette.
     */
    strokeDelta: DesignToken.Number;
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
    minContrast: DesignToken.Number;
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

// The tokens that a function of any library with `Root` reads, which are the ones that `Root` has to have. The compiler can't follow a property of the
// context of a type parameter to the type of its value, but it can see that the context is the one of the type it extends.
const readTokens = <Root extends ColorSetLibraryTokens>(tokens: Library.Context<Root>): Library.Context<ColorSetLibraryTokens> => tokens;

// What the sets are made from and made for. The `palette` is what the sets are made from, which is the only thing that is not in a token
// at a fixed place, so it is the one thing that a palette gives.
interface SetInputs {
    palette: Palette;
    reference: Color;
    disabledPalette: Palette;
}

// The deltas of the subtle fill in the other direction. A disabled color is not an inversion of anything, so it is the same.
const inverseOf = (deltas: InteractiveSet<number>): InteractiveSet<number> =>
    mapStates(deltas, (delta, state) => (state === InteractiveState.disabled ? delta : -delta));

/**
 * The options of the color sets of a palette.
 *
 * @public
 */
export interface ColorSetsOptions<Root extends ColorSetLibraryTokens> {
    /**
     * Gets the palette that the sets are made from, usually the value of a palette token.
     */
    palette: (tokens: Library.Context<Root>) => Palette;
    /**
     * Gets if the sets are semitransparent over the color context, which they are not if it is not given.
     */
    asOverlay?: (tokens: Library.Context<Root>) => boolean;
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
 * brand: {
 *     palette: paletteFrom(t => t.brand.primary.$value, t => t.color.paletteOptions.stepSize.$value),
 *     ...createColorSets({ palette: t => t.color.brand.palette.$value }),
 * },
 * ```
 *
 * @param options - Where the palette is, and if the sets are an overlay
 * @returns The config of the `fill` and `stroke` sets
 *
 * @public
 */
export function createColorSets<Root extends ColorSetLibraryTokens>(options: ColorSetsOptions<Root>): Library.Config<ColorSetTokens, Root> {
    type Tokens = Library.Context<ColorSetLibraryTokens>;
    type Make = (inputs: SetInputs, tokens: Tokens) => InteractiveColorSet;

    // A set is made once for the state of all its values, from the inputs that every one of them reads.
    const set = (properties: StyleProperty[], make: Make): Library.ConfigValue<InteractiveToken<Color>, Root> => ({
        $type: AdaptiveDesignToken.interactive,
        $value: tokens => {
            const { context, disabled } = readTokens(tokens).color;
            const made = make({ palette: options.palette(tokens), reference: context.$value, disabledPalette: disabled.palette.$value }, readTokens(tokens));
            return options.asOverlay ? colorSetAsOverlay(made, context.$value, options.asOverlay(tokens)) : made;
        },
        $extensions: intendedFor(...properties),
    });

    const byDelta =
        (deltas: (tokens: Tokens) => Library.Context<InteractiveDeltaTokens>, zeroAsTransparent = false): Make =>
        ({ palette, reference, disabledPalette }, tokens) =>
            deltaColorSet(palette, reference, interactiveDeltas(deltas(tokens)), { disabledPalette, zeroAsTransparent });

    const byIdeal =
        (minContrast: (tokens: Tokens) => number, deltas: (tokens: Tokens) => Library.Context<InteractiveDeltaTokens>): Make =>
        ({ palette, reference, disabledPalette }, tokens) =>
            idealColorDeltaSet(palette, reference, minContrast(tokens), palette.source, interactiveDeltas(deltas(tokens)), { disabledPalette });

    const byContrast =
        (
            minContrast: (tokens: Tokens) => number,
            deltas: (tokens: Tokens) => Library.Context<InteractiveDeltaTokens>,
            zeroAsTransparent = false
        ): Make =>
        ({ palette, reference, disabledPalette }, tokens) =>
            contrastAndDeltaColorSet(palette, reference, minContrast(tokens), interactiveDeltas(deltas(tokens)), { disabledPalette, zeroAsTransparent });

    const minContrasts = (tokens: Tokens) => tokens.color.wcagContrast.minContrast;
    const fillDeltas = (tokens: Tokens) => tokens.color.deltas.fill;
    const strokeDeltas = (tokens: Tokens) => tokens.color.deltas.stroke;
    const fill = [StyleProperty.backgroundFill];
    const stroke = [...StylePropertyShorthand.borderFill];
    const strokeOrForeground = [...StylePropertyShorthand.borderFill, StyleProperty.foregroundFill];

    return {
        fill: {
            stealth: set(fill, byDelta(t => fillDeltas(t).stealth, true)),
            subtle: set(fill, byDelta(t => fillDeltas(t).subtle)),
            subtleInverse: set(fill, ({ palette, reference, disabledPalette }, tokens) =>
                deltaColorSet(palette, reference, inverseOf(interactiveDeltas(fillDeltas(tokens).subtle)), { disabledPalette })
            ),
            ideal: set(fill, byIdeal(t => minContrasts(t).ideal.$value, t => fillDeltas(t).ideal)),
            discernible: set(fill, byIdeal(t => minContrasts(t).discernible.$value, t => fillDeltas(t).discernible)),
            readable: set(fill, byIdeal(t => minContrasts(t).readable.$value, t => fillDeltas(t).readable)),
        },
        stroke: {
            safety: set(stroke, (inputs, tokens) => {
                const minContrast = minContrasts(tokens).safety.$value;
                return conditionalColorSet(byContrast(() => minContrast, t => strokeDeltas(t).safety)(inputs, tokens), minContrast > 0);
            }),
            stealth: set(stroke, byContrast(t => minContrasts(t).safety.$value, t => strokeDeltas(t).stealth, true)),
            subtle: set(stroke, byContrast(t => minContrasts(t).subtle.$value, t => strokeDeltas(t).subtle)),
            discernible: set(strokeOrForeground, byContrast(t => minContrasts(t).discernible.$value, t => strokeDeltas(t).discernible)),
            readable: set(strokeOrForeground, byContrast(t => minContrasts(t).readable.$value, t => strokeDeltas(t).readable)),
            strong: set(strokeOrForeground, byContrast(t => minContrasts(t).strong.$value, t => strokeDeltas(t).strong)),
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
 * foreground: blackOrWhiteReadable(t => t.color.accent.fill.readable.$value),
 * ```
 *
 * @param background - Gets the values of the background, usually the value of an interactive token
 * @param minContrast - Gets the minimum contrast of the foreground from each state of the background
 * @param defaultBlack - True to be black when both black and white have the contrast
 *
 * @public
 */
export function blackOrWhiteFor<Root extends ColorSetLibraryTokens>(
    background: (tokens: Library.Context<Root>) => InteractivePaintSet,
    minContrast: (tokens: Library.Context<Root>) => number,
    defaultBlack = false
): Library.ConfigValue<InteractiveToken<Color>, Root> {
    return {
        $type: AdaptiveDesignToken.interactive,
        $value: tokens => blackOrWhiteByContrastSet(background(tokens), minContrast(tokens), defaultBlack),
        $extensions: intendedFor(StyleProperty.foregroundFill),
    };
}

/**
 * The config of a foreground that is black or white for a background, with the contrast that is discernible. It is for something that isn't
 * text, like a checked checkbox.
 *
 * @param background - Gets the values of the background, usually the value of an interactive token
 *
 * @public
 */
export function blackOrWhiteDiscernible<Root extends ColorSetLibraryTokens>(
    background: (tokens: Library.Context<Root>) => InteractivePaintSet
): Library.ConfigValue<InteractiveToken<Color>, Root> {
    return blackOrWhiteFor<Root>(background, tokens => readTokens(tokens).color.wcagContrast.minContrast.discernible.$value);
}

/**
 * The config of a foreground that is black or white for a background, with the contrast that is readable. It is for text, like the label of a
 * button.
 *
 * @param background - Gets the values of the background, usually the value of an interactive token
 *
 * @public
 */
export function blackOrWhiteReadable<Root extends ColorSetLibraryTokens>(
    background: (tokens: Library.Context<Root>) => InteractivePaintSet
): Library.ConfigValue<InteractiveToken<Color>, Root> {
    return blackOrWhiteFor<Root>(background, tokens => readTokens(tokens).color.wcagContrast.minContrast.readable.$value);
}

// The minimum contrast of a level: what it is for AA, and what for AAA.
const minContrastFor = (aa: number, aaa: number): Library.ConfigValue<DesignToken.Number, ColorLibraryTokens> => ({
    $type: DesignToken.Type.Number,
    $value: tokens => (tokens.color.wcagContrast.level.$value === WcagContrastLevel.aa ? aa : aaa),
});

const wcagContrast: Library.Config<WcagContrastTokens, ColorLibraryTokens> = {
    level: { $type: AdaptiveDesignToken.wcagContrastLevel, $value: WcagContrastLevel.aa },
    minContrast: {
        safety: minContrastFor(0, 3),
        subtle: minContrastFor(1.5, 3),
        ideal: minContrastFor(2, 3),
        discernible: minContrastFor(3, 4.5),
        readable: minContrastFor(4.5, 7),
        strong: { $type: DesignToken.Type.Number, $value: 12 },
    },
};

const disabled: Library.Config<DisabledTokens, ColorLibraryTokens> = {
    palette: { $type: AdaptiveDesignToken.palette, $value: tokens => tokens.color.layer.palette },
    fillDelta: { $type: DesignToken.Type.Number, $value: 3 },
    strokeDelta: { $type: DesignToken.Type.Number, $value: 8 },
};

// The deltas of a recipe, a number of steps for the rest, the hover, and the active. The focus is the rest until it is set, and the
// disabled is the shared one of the fills or of the strokes, or a number of its own: a recipe with no color at rest has none disabled.
// The group is where it is given, since a token can't say where it is, so it can refer to the rest.
const deltas = (
    group: (tokens: Library.Context<ColorLibraryTokens>) => Library.Context<InteractiveDeltaTokens>,
    steps: { rest: number; hover: number; active: number },
    disabledDelta: "fill" | "stroke" | number
): Library.Config<InteractiveDeltaTokens, ColorLibraryTokens> => ({
    $type: DesignToken.Type.Number,
    rest: { $value: steps.rest },
    hover: { $value: steps.hover },
    active: { $value: steps.active },
    focus: { $value: tokens => group(tokens).rest },
    disabled: {
        $value:
            disabledDelta === "fill"
                ? tokens => tokens.color.disabled.fillDelta
                : disabledDelta === "stroke"
                ? tokens => tokens.color.disabled.strokeDelta
                : disabledDelta,
    },
});

const colorDeltas: Library.Config<ColorDeltaTokens, ColorLibraryTokens> = {
    fill: {
        stealth: deltas(t => t.color.deltas.fill.stealth, { rest: 0, hover: 3, active: 2 }, 0),
        subtle: deltas(t => t.color.deltas.fill.subtle, { rest: 3, hover: 4, active: 2 }, "fill"),
        ideal: deltas(t => t.color.deltas.fill.ideal, { rest: 0, hover: -2, active: 2 }, "fill"),
        discernible: deltas(t => t.color.deltas.fill.discernible, { rest: 0, hover: 6, active: 3 }, "fill"),
        readable: deltas(t => t.color.deltas.fill.readable, { rest: 0, hover: -2, active: 2 }, "fill"),
    },
    stroke: {
        safety: deltas(t => t.color.deltas.stroke.safety, { rest: 0, hover: 6, active: -6 }, 0),
        stealth: deltas(t => t.color.deltas.stroke.stealth, { rest: 0, hover: 6, active: -6 }, 0),
        subtle: deltas(t => t.color.deltas.stroke.subtle, { rest: 0, hover: 4, active: -2 }, "stroke"),
        discernible: deltas(t => t.color.deltas.stroke.discernible, { rest: 0, hover: 8, active: -4 }, "stroke"),
        readable: deltas(t => t.color.deltas.stroke.readable, { rest: 0, hover: 6, active: -6 }, "stroke"),
        strong: deltas(t => t.color.deltas.stroke.strong, { rest: 0, hover: 10, active: -10 }, "stroke"),
    },
};

const focusStroke: Library.Config<FocusStrokeTokens, ColorLibraryTokens> = {
    $root: {
        $type: DesignToken.Type.Color,
        $value: tokens => {
            const { palette, minContrast } = tokens.color.focusStroke;
            return contrastColor(palette.$value, tokens.color.context.$value, minContrast.$value);
        },
        $extensions: intendedFor(...StylePropertyShorthand.borderFill, StyleProperty.outlineColor),
    },
    palette: { $type: AdaptiveDesignToken.palette, $value: tokens => tokens.color.accent.palette },
    minContrast: { $type: DesignToken.Type.Number, $value: tokens => tokens.color.wcagContrast.minContrast.discernible },
    outer: {
        $type: DesignToken.Type.Color,
        $value: tokens => blackOrWhiteByContrast(tokens.color.context.$value, tokens.color.wcagContrast.minContrast.readable.$value, true),
        $extensions: intendedFor(...StylePropertyShorthand.borderFill),
    },
    inner: {
        $type: DesignToken.Type.Color,
        $value: tokens => blackOrWhiteByContrast(tokens.color.focusStroke.outer.$value, tokens.color.wcagContrast.minContrast.readable.$value, false),
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
        ...createColorSets<ColorLibraryTokens>({
            palette: tokens => tokens.color.neutral.palette.$value,
            asOverlay: tokens => tokens.color.neutral.asOverlay.$value,
        }),
        asOverlay: { $type: AdaptiveDesignToken.boolean, $value: false },
    },
    accent: { ...palettes.accent, ...setsOf(tokens => tokens.color.accent.palette.$value) },
    highlight: { ...palettes.highlight, ...setsOf(tokens => tokens.color.highlight.palette.$value) },
    critical: { ...palettes.critical, ...setsOf(tokens => tokens.color.critical.palette.$value) },
    warning: { ...palettes.warning, ...setsOf(tokens => tokens.color.warning.palette.$value) },
    success: { ...palettes.success, ...setsOf(tokens => tokens.color.success.palette.$value) },
    info: { ...palettes.info, ...setsOf(tokens => tokens.color.info.palette.$value) },
    focusStroke,
};

/**
 * Creates a library with the color tokens.
 *
 * @public
 */
export const createColorLibrary = () => Library.create<ColorLibraryTokens>({ color });
