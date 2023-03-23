import { Swatch } from "../color/swatch.js";
import type { InteractiveTokenSet, Styles } from "../types.js";
import {
    accentFillReadableActive,
    accentFillReadableFocus,
    accentFillReadableHover,
    accentFillReadableRest,
    accentForegroundActive,
    accentForegroundFocus,
    accentForegroundHover,
    accentForegroundRest,
    fillColor,
    foregroundOnAccentActive,
    foregroundOnAccentFocus,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    neutralFillPerceivableActive,
    neutralFillPerceivableFocus,
    neutralFillPerceivableHover,
    neutralFillPerceivableRest,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillSubtleActive,
    neutralFillSubtleFocus,
    neutralFillSubtleHover,
    neutralFillSubtleRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralStrokePerceivableActive,
    neutralStrokePerceivableFocus,
    neutralStrokePerceivableHover,
    neutralStrokePerceivableRest,
    neutralStrokeReadableRest,
    neutralStrokeSubtleActive,
    neutralStrokeSubtleFocus,
    neutralStrokeSubtleHover,
    neutralStrokeSubtleRest,
} from "./color.js";

/**
 * @public
 */
export const accentFillReadableInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: accentFillReadableRest,
    hover: accentFillReadableHover,
    active: accentFillReadableActive,
    focus: accentFillReadableFocus,
};

/**
 * @public
 */
export const foregroundOnAccentInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: foregroundOnAccentRest,
    hover: foregroundOnAccentHover,
    active: foregroundOnAccentActive,
    focus: foregroundOnAccentFocus,
};

/**
 * @public
 */
export const accentForegroundInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: accentForegroundRest,
    hover: accentForegroundHover,
    active: accentForegroundActive,
    focus: accentForegroundFocus,
};

/**
 * @public
 */
export const neutralFillStealthInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralFillStealthRest,
    hover: neutralFillStealthHover,
    active: neutralFillStealthActive,
    focus: neutralFillStealthFocus,
};

/**
 * @public
 */
export const neutralFillSubtleInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralFillSubtleRest,
    hover: neutralFillSubtleHover,
    active: neutralFillSubtleActive,
    focus: neutralFillSubtleFocus,
};

/**
 * @public
 */
export const neutralFillPerceivableInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralFillPerceivableRest,
    hover: neutralFillPerceivableHover,
    active: neutralFillPerceivableActive,
    focus: neutralFillPerceivableFocus,
};

/**
 * @public
 */
export const neutralForegroundInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralForegroundRest,
    hover: neutralForegroundHover,
    active: neutralForegroundActive,
    focus: neutralForegroundFocus,
};

/**
 * @public
 */
export const neutralStrokeSubtleInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralStrokeSubtleRest,
    hover: neutralStrokeSubtleHover,
    active: neutralStrokeSubtleActive,
    focus: neutralStrokeSubtleFocus,
};

/**
 * @public
 */
export const neutralStrokePerceivableInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralStrokePerceivableRest,
    hover: neutralStrokePerceivableHover,
    active: neutralStrokePerceivableActive,
    focus: neutralStrokePerceivableFocus,
};

/**
 * Convenience style module for an accent-filled control.
 *
 * @public
 */
export const accentFillControlStyles: Styles = {
    "background-color": accentFillReadableInteractiveSet,
    "border-color": "transparent",
    "color": foregroundOnAccentInteractiveSet,
};

/**
 * Convenience style module for a neutral-filled control.
 *
 * @public
 */
export const neutralFillControlStyles: Styles = {
    "background-color": neutralFillSubtleInteractiveSet,
    "border-color": neutralStrokeSubtleInteractiveSet,
    "color": neutralForegroundRest,
};

/**
 * Convenience style module for a neutral control with accessibility requirements, like a checkbox.
 *
 * @public
 */
export const neutralPerceivableControlStyles: Styles = {
    "background-color": neutralFillSubtleInteractiveSet,
    "border-color": neutralStrokePerceivableInteractiveSet,
    "color": neutralForegroundRest,
};

/**
 * Convenience style module for a neutral-outlined control.
 *
 * @public
 */
export const neutralOutlineControlStyles: Styles = {
    "background-color": fillColor,
    "border-color": neutralStrokePerceivableInteractiveSet,
    "color": neutralForegroundRest,
};

/**
 * Convenience style module for a neutral stealth control.
 *
 * @public
 */
export const neutralStealthControlStyles: Styles = {
    "background-color": neutralFillStealthInteractiveSet,
    "border-color": "transparent",
    "color": neutralForegroundRest,
};

/**
 * Convenience style module for accent-colored text or icons.
 *
 * @public
 */
export const accentForegroundReadableStyles: Styles = {
    "border-color": "transparent",
    "color": accentForegroundInteractiveSet,
};

/**
 * Convenience style module for neutral-colored hint or placeholder text or icons.
 *
 * @public
 */
export const neutralForegroundReadableStyles: Styles = {
    "border-color": "transparent",
    "color": neutralStrokeReadableRest,
};

/**
 * Convenience style module for neutral-colored main text or icons.
 *
 * @public
 */
export const neutralForegroundStrongStyles: Styles = {
    "border-color": "transparent",
    "color": neutralForegroundInteractiveSet,
};
