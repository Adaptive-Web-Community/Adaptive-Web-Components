import { InteractiveSwatchSet } from "../recipe.js";
import { Swatch } from "../swatch.js";
import { blackOrWhiteByContrast } from "./black-or-white-by-contrast.js";

/**
 * Gets an interactive set of black or white Swatches based on the reference color for each state and minimum contrast.
 *
 * This is commonly used for something like foreground color on an accent-filled Button.
 *
 * This algorithm ignores the contrast check for active state if rest and hover produce the same color, and uses that
 * color directly. This is because many times something like a Button has slight luminance variation between rest, hover,
 * and active states, but generally flipping the text color produces a flash and is more unexpected.
 *
 * @param restReference - The rest state reference color
 * @param hoverReference - The hover state reference color
 * @param activeReference - The active state reference color
 * @param focusReference - The focus state reference color
 * @param minContrast - The minimum contrast required for black or white from each reference color
 * @param defaultBlack - True to default to black if both black or white meet contrast
 * @returns The interactive set of black or white Swatches.
 *
 * @public
 */
export function blackOrWhiteByContrastSet(
    set: InteractiveSwatchSet,
    minContrast: number,
    defaultBlack: boolean
): InteractiveSwatchSet {
    const defaultRule: (reference: Swatch | null) => Swatch | null = (reference) =>
        reference ? blackOrWhiteByContrast(reference, minContrast, defaultBlack) : null;

    const restForeground = defaultRule(set.rest);
    const hoverForeground = defaultRule(set.hover);
    // Active does not have contrast requirements, so if rest and hover use the same color, use that for active
    // even if it would not have passed the contrast check.
    const activeForeground =
        restForeground && hoverForeground && restForeground.relativeLuminance === hoverForeground.relativeLuminance
            ? restForeground
            : defaultRule(set.active);
    const focusForeground = defaultRule(set.focus);
    const disabled = defaultRule(set.disabled);
    // TODO: Reasonable disabled opacity, but not configurable.
    // Considering replacing these recipes anyway.
    const disabledForeground = disabled?.toTransparent(0.3) ?? null;

    return {
        rest: restForeground,
        hover: hoverForeground,
        active: activeForeground,
        focus: focusForeground,
        disabled: disabledForeground,
    };
}
