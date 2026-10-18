import { Color, withAlpha } from "../color.js";
import { InteractiveState, mapStates } from "../../interactive.js";
import { InteractiveColorSet, InteractivePaintSet } from "../interactive-set.js";
import { Paint } from "../paint.js";
import { relativeLuminance } from "../utilities/relative-luminance.js";
import { blackOrWhiteByContrast } from "./black-or-white-by-contrast.js";

/**
 * Gets an interactive set of black or white Colors based on the reference color for each state and minimum contrast.
 *
 * This is commonly used for something like foreground color on an accent-filled Button.
 *
 * This algorithm ignores the contrast check for active state if rest and hover produce the same color, and uses that
 * color directly. This is because many times something like a Button has slight luminance variation between rest, hover,
 * and active states, but generally flipping the text color produces a flash and is more unexpected.
 *
 * @param set - The reference color for each state
 * @param minContrast - The minimum contrast required for black or white from each reference color
 * @param defaultBlack - True to default to black if both black or white meet contrast
 * @returns The interactive set of black or white Colors.
 *
 * @public
 */
export function blackOrWhiteByContrastSet(
    set: InteractivePaintSet,
    minContrast: number,
    defaultBlack: boolean
): InteractiveColorSet {
    const defaultRule = (reference: Paint): Color => blackOrWhiteByContrast(reference, minContrast, defaultBlack);

    // Active does not have contrast requirements, so if rest and hover use the same color, use that for active
    // even if it would not have passed the contrast check.
    const restForeground = set.rest ? defaultRule(set.rest) : undefined;
    const hoverForeground = set.hover ? defaultRule(set.hover) : undefined;
    const activeFollowsRest =
        restForeground && hoverForeground && relativeLuminance(restForeground) === relativeLuminance(hoverForeground);

    return mapStates(set, (reference, state) => {
        if (state === InteractiveState.active && activeFollowsRest) {
            return restForeground;
        }
        const foreground = defaultRule(reference);
        // TODO: Reasonable disabled opacity, but not configurable.
        // Considering replacing these recipes anyway.
        return state === InteractiveState.disabled ? withAlpha(foreground, 0.3) : foreground;
    });
}
