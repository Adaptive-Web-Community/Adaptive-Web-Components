import { DesignToken, Library, recipes, refs } from "design-token-library";
import { hueShiftGradient } from "../core/color/recipes/hue-shift-gradient.js";
import { twoPaletteGradient } from "../core/color/recipes/two-palette-gradient.js";
import { StyleProperty } from "../core/styles/properties.js";
import { treatment, TreatmentToken } from "../core/styles/treatment-token.js";
import { intendedFor } from "../core/token-metadata.js";
import { AdaptiveDesignToken, PaintToken } from "../core/token-types.js";
import { ColorLibraryTokens, ColorTokens } from "./color.js";
import { densityBorder } from "./util.js";

/**
 * The recipes of the experimental gradients, which a system changes with `override()` when it extends a library.
 *
 * @beta
 */
export const experimentalRecipes = recipes({
    hueShiftGradient,
    twoPaletteGradient,
});

/**
 * The tokens that the experimental gradients read, under `color.gradient`.
 *
 * @beta
 */
export interface GradientTokens {
    /**
     * The angle of the gradients, in degrees. 180 is from the top to the bottom, which is what CSS draws without an angle.
     */
    angle: DesignToken.Number;

    /**
     * The shift of the hue at the start of a hue shift gradient, in degrees.
     */
    startShift: DesignToken.Number;

    /**
     * The shift of the hue at the end of a hue shift gradient, in degrees.
     */
    endShift: DesignToken.Number;
}

/**
 * A fill of a palette that is a gradient, made relative to the color context.
 *
 * @beta
 */
export interface GradientFillTokens {
    fill: {
        /** At the delta of the subtle fill at rest. */
        subtle: PaintToken;
    };
}

/**
 * The experimental tokens, under `color`: the gradients and what they read.
 *
 * @beta
 */
export interface ExperimentalColorTokens {
    gradient: GradientTokens;
    /** The accent palette with its hue shifted toward the start and the end. */
    accentHueShiftGradient: GradientFillTokens;
    /** From the accent palette to the highlight palette. */
    accentToHighlightGradient: GradientFillTokens;
}

/**
 * The tokens of a library that has the colors and the experimental tokens.
 *
 * @beta
 */
export interface ExperimentalLibraryTokens extends ColorLibraryTokens {
    color: ColorTokens & ExperimentalColorTokens;
}

const tokens = refs<ExperimentalLibraryTokens>().color;

/**
 * The configuration of the experimental tokens, for the library, to spread into the `color` group with the color tokens.
 *
 * @beta
 */
export const experimentalColor: Library.Config<ExperimentalColorTokens, ExperimentalLibraryTokens> = {
    gradient: {
        angle: { $type: DesignToken.Type.Number, $value: 180 },
        // 0.14 had 15, which shifted both ends the same way, a bug: the start shifts the other way, as the recipe does by default.
        startShift: { $type: DesignToken.Type.Number, $value: -15 },
        endShift: { $type: DesignToken.Type.Number, $value: 15 },
    },
    accentHueShiftGradient: {
        fill: {
            subtle: {
                $type: AdaptiveDesignToken.paint,
                $value: experimentalRecipes.hueShiftGradient(tokens.accent.palette, tokens.context, tokens.deltas.fill.subtle.rest, {
                    angle: tokens.gradient.angle,
                    startShift: tokens.gradient.startShift,
                    endShift: tokens.gradient.endShift,
                }),
                $extensions: intendedFor(StyleProperty.backgroundFill),
            },
        },
    },
    accentToHighlightGradient: {
        fill: {
            subtle: {
                $type: AdaptiveDesignToken.paint,
                $value: experimentalRecipes.twoPaletteGradient(
                    tokens.accent.palette,
                    tokens.highlight.palette,
                    tokens.context,
                    tokens.deltas.fill.subtle.rest,
                    { angle: tokens.gradient.angle }
                ),
                $extensions: intendedFor(StyleProperty.backgroundFill),
            },
        },
    },
};

/**
 * The experimental treatments, with the treatments of the accent palette.
 *
 * @beta
 */
export interface ExperimentalTreatmentTokens {
    color: {
        accent: {
            treatments: {
                /** The accent hue shift gradient as the fill of an element, and the disabled fill when it is disabled. */
                hueShiftGradientFillSubtleElement: TreatmentToken;
                /** The accent to highlight gradient as the fill of an element, and the disabled fill when it is disabled. */
                toHighlightGradientFillSubtleElement: TreatmentToken;
            };
        };
    };
}

/**
 * The configuration of the experimental treatments, for the library, which puts them in the treatments of the accent palette.
 *
 * @beta
 */
export const experimentalTreatments: Library.Config<ExperimentalTreatmentTokens, ExperimentalLibraryTokens & ExperimentalTreatmentTokens> = {
    color: {
        accent: {
            treatments: {
                hueShiftGradientFillSubtleElement: treatment(
                    {
                        properties: {
                            backgroundFill: { rest: tokens.accentHueShiftGradient.fill.subtle, disabled: tokens.neutral.fill.subtle },
                            ...densityBorder(tokens.accent.stroke.safety),
                        },
                    },
                    { formerNames: ["color.accent-hue-shift-gradient-fill-subtle-element"] }
                ),
                toHighlightGradientFillSubtleElement: treatment(
                    {
                        properties: {
                            backgroundFill: { rest: tokens.accentToHighlightGradient.fill.subtle, disabled: tokens.neutral.fill.subtle },
                            ...densityBorder(tokens.accent.stroke.safety),
                        },
                    },
                    { formerNames: ["color.accent-to-highlight-gradient-fill-subtle-element"] }
                ),
            },
        },
    },
};
