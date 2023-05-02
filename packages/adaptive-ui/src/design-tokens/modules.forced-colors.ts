import { SystemColors } from "@microsoft/fast-web-utilities";
import { InteractiveSet } from "../types.js";
import { Styles } from "../modules/styles.js";

/**
 * Convenience function for styles that share rest/focus and hover/active states.
 *
 * @param restAndFocus - The value to use for rest and focus states.
 * @param hoverAndActive - The value to use for hover and active states.
 * @returns A full interactive color set.
 */
function set(
    restAndFocus: string,
    hoverAndActive: string,
): InteractiveSet<string> {
    return {
        rest: restAndFocus,
        hover: hoverAndActive,
        active: hoverAndActive,
        focus: restAndFocus,
        disabled: SystemColors.GrayText,
    };
}

/**
 * @public
 */
export const forcedColorsButtonStyles: Styles = Styles.fromProperties({
    backgroundFill: {
        ...set(SystemColors.ButtonFace, SystemColors.HighlightText),
    },
    foregroundFill: {
        ...set(SystemColors.ButtonText, SystemColors.Highlight),
    },
    borderFill: {
        ...set(SystemColors.ButtonText, SystemColors.Highlight),
    },
});

/**
 * @public
 */
export const forcedColorsHighlightStyles: Styles = Styles.fromProperties({
    backgroundFill: {
        ...set(SystemColors.Highlight, SystemColors.ButtonFace),
    },
    foregroundFill: {
        ...set(SystemColors.HighlightText, SystemColors.ButtonText),
    },
    borderFill: {
        ...set(SystemColors.Highlight, SystemColors.ButtonText),
    },
});

/**
 * @public
 */
export const forcedColorsTextStyles: Styles = Styles.fromProperties({
    foregroundFill: SystemColors.CanvasText,
});
