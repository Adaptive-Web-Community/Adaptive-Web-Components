import { refs } from "design-token-library";
import { StyleProperties, StyleValues } from "../core/styles/properties.js";
import { AppearanceTokens } from "./appearance.js";

// Note that this file is not exported from the package.

/**
 * @internal
 */
export const transparent = "transparent";

const { shape } = refs<AppearanceTokens>();

// TODO: There's a bit of an overlap right now where density calculations assume a border thickness,
// but setting the color is done elsewhere or not at all, producing inconsistent and unpredictable styling.

/**
 * The properties of a border of the default stroke thickness, which the density of a control allows for, in a color.
 *
 * @internal
 */
export const densityBorder = (fill: StyleValues): StyleProperties => ({
    borderThickness: shape.strokeThickness.default,
    borderStyle: "solid",
    borderFill: fill,
});
