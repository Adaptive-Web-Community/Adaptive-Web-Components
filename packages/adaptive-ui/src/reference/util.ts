import { StyleValue } from "../core/modules/styles.js";
import { strokeThickness } from "./appearance.js";

// Note that this file is not exported from the package.

/**
 * @internal
 */
export const transparent = "transparent";

// TODO: There's a bit of an overlap right now where density calculations assume a border thickness,
// but setting the color is done elsewhere or not at all, producing inconsistent and unpredictable styling.

/**
 * @internal
 */
export const densityBorderStyles = (fillValue: StyleValue) => {
    return {
        borderThickness: strokeThickness,
        borderStyle: "solid",
        borderFill: fillValue,
    }
};
