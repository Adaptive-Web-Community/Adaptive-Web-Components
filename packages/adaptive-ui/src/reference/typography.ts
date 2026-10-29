import { DesignToken, Library, px, refs } from "design-token-library";
import { AdaptiveDesignToken, FontStyleToken } from "../core/token-types.js";
import { typeRamp, TypeRampTokens, typeScale, TypeScaleTokens } from "../core/typography/type-ramp.js";

/**
 * The tokens of typography, a family, weight, and style for each of the default, body, and label text, and the type
 * ramps.
 *
 * @public
 */
export interface TypographyTokens {
    fontFamily: {
        $type: DesignToken.Type.FontFamily;
        default: DesignToken.FontFamily;
        body: DesignToken.FontFamily;
        label: DesignToken.FontFamily;
    };
    fontWeight: {
        $type: DesignToken.Type.FontWeight;
        default: DesignToken.FontWeight;
        body: DesignToken.FontWeight;
        label: DesignToken.FontWeight;
    };
    fontStyle: {
        $type: typeof AdaptiveDesignToken.fontStyle;
        default: FontStyleToken;
        body: FontStyleToken;
        label: FontStyleToken;
    };
    ramp: {
        /**
         * The complete type ramp with all positions from minus2 to plus6.
         */
        default: TypeRampTokens;

        /**
         * The type ramp for body copy, a scale from a base size and a multiplier.
         */
        body: TypeScaleTokens;
    };
}

/**
 * The tokens of a library that has the typography tokens.
 *
 * @public
 */
export interface TypographyLibraryTokens {
    typography: TypographyTokens;
}

const tokens = refs<TypographyLibraryTokens>().typography;

/**
 * The configuration of the typography tokens, for the library.
 *
 * @public
 */
export const typography: Library.Config<TypographyTokens, TypographyLibraryTokens> = {
    fontFamily: {
        $type: DesignToken.Type.FontFamily,
        default: { $value: ["Arial", "Helvetica", "sans-serif"] },
        body: { $value: tokens.fontFamily.default },
        label: { $value: tokens.fontFamily.default },
    },
    fontWeight: {
        $type: DesignToken.Type.FontWeight,
        default: { $value: "normal" },
        body: { $value: tokens.fontWeight.default },
        label: { $value: tokens.fontWeight.default },
    },
    fontStyle: {
        $type: AdaptiveDesignToken.fontStyle,
        default: { $value: "normal" },
        body: { $value: tokens.fontStyle.default },
        label: { $value: tokens.fontStyle.default },
    },
    ramp: {
        default: typeRamp({
            minus2: { fontSize: px(10), lineHeight: px(12), lineHeightMultiline: px(14) },
            minus1: { fontSize: px(12), lineHeight: px(14), lineHeightMultiline: px(16) },
            base: { fontSize: px(14), lineHeight: px(16), lineHeightMultiline: px(18) },
            plus1: { fontSize: px(16), lineHeight: px(22), lineHeightMultiline: px(24) },
            plus2: { fontSize: px(20), lineHeight: px(26), lineHeightMultiline: px(28) },
            plus3: { fontSize: px(24), lineHeight: px(32), lineHeightMultiline: px(34) },
            plus4: { fontSize: px(28), lineHeight: px(36), lineHeightMultiline: px(38) },
            plus5: { fontSize: px(32), lineHeight: px(40), lineHeightMultiline: px(42) },
            plus6: { fontSize: px(40), lineHeight: px(52), lineHeightMultiline: px(56) },
        }),
        body: typeScale(tokens.ramp.body, px(16), 1.21, 1.35),
    },
};

/**
 * Creates a library with the typography tokens.
 *
 * @public
 */
export const createTypographyLibrary = () => Library.create<TypographyLibraryTokens>({ typography });
