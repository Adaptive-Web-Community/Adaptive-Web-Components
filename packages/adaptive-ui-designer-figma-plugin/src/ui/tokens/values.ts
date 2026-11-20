import { AdaptiveDesignToken, parseColor, WcagContrastLevel } from "@adaptive-web/adaptive-ui";
import { DesignToken } from "design-token-library";

type Dimension = DesignToken.Values.Readonly.Dimension;

const dimensionPattern = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem)?$/;

function parseDimension(text: string): Dimension | undefined {
    const match = dimensionPattern.exec(text);
    return match ? { value: Number.parseFloat(match[1]), unit: (match[2] ?? "px") as Dimension["unit"] } : undefined;
}

function parseNumber(text: string): number | undefined {
    const value = Number(text);
    return text !== "" && Number.isFinite(value) ? value : undefined;
}

/**
 * The types of the tokens that a designer gives a value to, which {@link parseTokenValue} reads.
 */
export const overridableTypes: ReadonlySet<string> = new Set<string>([
    DesignToken.Type.Color,
    DesignToken.Type.Dimension,
    DesignToken.Type.Number,
    DesignToken.Type.FontFamily,
    DesignToken.Type.FontWeight,
    AdaptiveDesignToken.boolean,
    AdaptiveDesignToken.contrastRatio,
    AdaptiveDesignToken.delta,
    AdaptiveDesignToken.expression,
    AdaptiveDesignToken.fontStyle,
    AdaptiveDesignToken.fontVariations,
    AdaptiveDesignToken.wcagContrastLevel,
]);

/**
 * Reads the value that a designer wrote for a token, by the `$type` of the token.
 *
 * @remarks
 * An override is kept as the string that was written, on the node, and parsed each time it is used: an evaluated value is never stored, so
 * what a node has is what the designer wrote (see `docs/decisions/0024-the-designer-overrides-the-given-tokens.md`).
 *
 * @param type - The `$type` of the token
 * @param text - The value as it is stored
 * @returns The value, or nothing for text that isn't a value of the type
 */
export function parseTokenValue(type: string, text: string): unknown {
    const value = text.trim();
    switch (type) {
        case DesignToken.Type.Color:
            return parseColor(value);
        case DesignToken.Type.Dimension:
            return parseDimension(value);
        case DesignToken.Type.Number:
        case AdaptiveDesignToken.contrastRatio:
        case AdaptiveDesignToken.delta:
            return parseNumber(value);
        case AdaptiveDesignToken.expression:
            return parseNumber(value) ?? parseDimension(value);
        case DesignToken.Type.FontWeight:
            return parseNumber(value) ?? (value === "" ? undefined : value);
        case AdaptiveDesignToken.boolean:
            return value === "true" ? true : value === "false" ? false : undefined;
        case AdaptiveDesignToken.wcagContrastLevel:
            return Object.values(WcagContrastLevel).find(level => level === value.toLowerCase());
        case DesignToken.Type.FontFamily:
        case AdaptiveDesignToken.fontStyle:
        case AdaptiveDesignToken.fontVariations:
            return value === "" ? undefined : value;
        default:
            return undefined;
    }
}
