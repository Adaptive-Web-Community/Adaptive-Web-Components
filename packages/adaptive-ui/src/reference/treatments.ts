import { refs } from "design-token-library";
import { AnatomyTreatments } from "../core/styles/css/style-rules.js";
import { Treatment } from "../core/styles/treatment.js";
import { ReferenceLibraryTokens } from "./library.js";
import { densityBorder, transparent } from "./util.js";

const { color, density, elevation, shape, typography } = refs<ReferenceLibraryTokens>();

/**
 * Treatment for the shape of a control.
 *
 * By default, sets the border radius, useful for buttons, inputs, list items, etc.
 *
 * @public
 */
export const controlShapeTreatment: Treatment = {
    name: "shape.control",
    properties: {
        cornerRadius: shape.cornerRadius.default,
    },
};

/**
 * Treatment for the shape of a layer.
 *
 * By default, sets the border radius, useful for card, panes, etc.
 *
 * @public
 */
export const layerShapeTreatment: Treatment = {
    name: "shape.layer",
    properties: {
        cornerRadius: shape.cornerRadius.layer,
    },
};

/**
 * Treatment for the shape of a rounded control (pill shape).
 *
 * By default, sets the border radius, useful for badge, radio, etc.
 *
 * @public
 */
export const roundShapeTreatment: Treatment = {
    name: "shape.round",
    properties: {
        cornerRadius: "999px",
    },
};

/**
 * Treatment for the density and spacing of plain text.
 *
 * By default, sets the padding and gap, useful for label and value pairs or stacked lines of text.
 *
 * @public
 */
export const textDensityTreatment: Treatment = {
    name: "density.text",
    properties: {
        paddingHorizontal: density.text.horizontal.padding,
        paddingVertical: density.text.vertical.padding,
        gap: density.text.horizontal.gap,
    },
};

/**
 * Treatment for the density and spacing of a control.
 *
 * By default, sets the padding and gap, useful for buttons, list items, etc.
 *
 * See {@link autofillOuterDensityTreatment} or {@link controlListDensityTreatment}.
 *
 * @public
 */
export const controlDensityTreatment: Treatment = {
    name: "density.control",
    properties: {
        paddingHorizontal: density.control.horizontal.padding,
        paddingVertical: density.control.vertical.padding,
        gap: density.control.horizontal.gap,
    },
};

/**
 * Treatment for the density and spacing of a *square* control.
 *
 * By default, sets the padding and gap, useful for icon-only buttons or other elements which should be square based on vertical size.
 *
 * See {@link autofillOuterDensityTreatment} or {@link controlListDensityTreatment}.
 *
 * @public
 */
export const controlSquareDensityTreatment: Treatment = {
    name: "density.control-square",
    properties: {
        padding: density.control.vertical.padding,
        gap: density.control.horizontal.gap,
    },
};

/**
 * Treatment pair (outer portion) for input controls that support autofill to allow for better handling of platform styling.
 *
 * By default, sets the horizontal padding and gap, useful for the container of wrapped inputs like text field.
 *
 * See {@link autofillInnerDensityTreatment}.
 *
 * @public
 */
export const autofillOuterDensityTreatment: Treatment = {
    name: "density.autofill-outer",
    properties: {
        paddingTop: "0",
        paddingRight: density.control.horizontal.padding,
        paddingBottom: "0",
        paddingLeft: density.control.horizontal.padding,
        gap: density.control.horizontal.gap,
    },
};

/**
 * Treatment pair (inner portion) for input controls that support autofill to allow for better handling of platform styling.
 *
 * By default, sets the vertical padding, useful for wrapped inputs like text field.
 *
 * See {@link autofillOuterDensityTreatment}.
 *
 * @public
 */
export const autofillInnerDensityTreatment: Treatment = {
    name: "density.autofill-inner",
    properties: {
        paddingTop: density.control.vertical.padding,
        paddingRight: "0",
        paddingBottom: density.control.vertical.padding,
        paddingLeft: "0",
    },
};

/**
 * Treatment for the density and spacing of a list of controls.
 *
 * By default, sets the padding and gap, useful for menus, lists of buttons, etc.
 *
 * @public
 */
export const controlListDensityTreatment: Treatment = {
    name: "density.control-list",
    properties: {
        paddingHorizontal: density.controlList.horizontal.padding,
        paddingVertical: density.controlList.vertical.padding,
        gap: density.controlList.horizontal.gap,
    },
};

/**
 * Treatment for the density and spacing of a layer.
 *
 * By default, sets the padding and gap, useful for cards, dialogs, etc.
 *
 * @public
 */
export const layerDensityTreatment: Treatment = {
    name: "density.layer",
    properties: {
        paddingHorizontal: density.layer.horizontal.padding,
        paddingVertical: density.layer.vertical.padding,
        gap: density.layer.horizontal.gap,
    },
};

/**
 * Convenience treatment for an accent-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - accent stealth background
 * - accent readable foreground (a11y)
 * - accent safety border
 *
 * @public
 */
export const accentFillStealthControlTreatment: Treatment = {
    name: "color.accent-fill-stealth-control",
    properties: {
        backgroundFill: color.accent.fill.stealth,
        foregroundFill: color.accent.onFill.stealth,
        ...densityBorder(color.accent.stroke.safety),
    },
};

/**
 * Convenience treatment for an accent-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - accent subtle background
 * - accent readable foreground (a11y)
 * - accent safety border
 *
 * @public
 */
export const accentFillSubtleControlTreatment: Treatment = {
    name: "color.accent-fill-subtle-control",
    properties: {
        backgroundFill: color.accent.fill.subtle,
        foregroundFill: color.accent.onFill.subtle,
        ...densityBorder(color.accent.stroke.safety),
    },
};

/**
 * Convenience treatment for an accent-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - accent subtle inverse background
 * - accent readable foreground (a11y)
 * - accent safety border
 *
 * @public
 */
export const accentFillSubtleInverseControlTreatment: Treatment = {
    name: "color.accent-fill-subtle-inverse-control",
    properties: {
        backgroundFill: color.accent.fill.subtleInverse,
        foregroundFill: color.accent.onFill.subtleInverse,
        ...densityBorder(color.accent.stroke.safety),
    },
};

/**
 * Convenience treatment for an accent-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - accent ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentFillIdealControlTreatment: Treatment = {
    name: "color.accent-fill-ideal-control",
    properties: {
        backgroundFill: color.accent.fill.ideal,
        foregroundFill: color.accent.onFill.ideal,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an accent-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - accent discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentFillDiscernibleControlTreatment: Treatment = {
    name: "color.accent-fill-discernible-control",
    properties: {
        backgroundFill: color.accent.fill.discernible,
        foregroundFill: color.accent.onFill.discernible,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an accent-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - accent readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentFillReadableControlTreatment: Treatment = {
    name: "color.accent-fill-readable-control",
    properties: {
        backgroundFill: color.accent.fill.readable,
        foregroundFill: color.accent.onFill.readable,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an accent-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - accent readable foreground
 * - accent discernible border
 *
 * @public
 */
export const accentOutlineDiscernibleControlTreatment: Treatment = {
    name: "color.accent-outline-discernible-control",
    properties: {
        ...densityBorder(color.accent.stroke.discernible),
        foregroundFill: color.accent.stroke.readable,
        backgroundFill: color.context,
    },
};

/**
 * Convenience treatment for an accent-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - accent readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentForegroundReadableControlTreatment: Treatment = {
    name: "color.accent-foreground-readable-control",
    properties: {
        foregroundFill: color.accent.stroke.readable,
    },
};

/**
 * Convenience treatment for an highlight-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - highlight stealth background
 * - highlight readable foreground (a11y)
 * - highlight safety border
 *
 * @public
 */
export const highlightFillStealthControlTreatment: Treatment = {
    name: "color.highlight-fill-stealth-control",
    properties: {
        backgroundFill: color.highlight.fill.stealth,
        foregroundFill: color.highlight.onFill.stealth,
        ...densityBorder(color.highlight.stroke.safety),
    },
};

/**
 * Convenience treatment for an highlight-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - highlight subtle background
 * - highlight readable foreground (a11y)
 * - highlight safety border
 *
 * @public
 */
export const highlightFillSubtleControlTreatment: Treatment = {
    name: "color.highlight-fill-subtle-control",
    properties: {
        backgroundFill: color.highlight.fill.subtle,
        foregroundFill: color.highlight.onFill.subtle,
        ...densityBorder(color.highlight.stroke.safety),
    },
};

/**
 * Convenience treatment for an highlight-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - highlight subtle inverse background
 * - highlight readable foreground (a11y)
 * - highlight safety border
 *
 * @public
 */
export const highlightFillSubtleInverseControlTreatment: Treatment = {
    name: "color.highlight-fill-subtle-inverse-control",
    properties: {
        backgroundFill: color.highlight.fill.subtleInverse,
        foregroundFill: color.highlight.onFill.subtleInverse,
        ...densityBorder(color.highlight.stroke.safety),
    },
};

/**
 * Convenience treatment for an highlight-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - highlight ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightFillIdealControlTreatment: Treatment = {
    name: "color.highlight-fill-ideal-control",
    properties: {
        backgroundFill: color.highlight.fill.ideal,
        foregroundFill: color.highlight.onFill.ideal,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an highlight-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - highlight discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightFillDiscernibleControlTreatment: Treatment = {
    name: "color.highlight-fill-discernible-control",
    properties: {
        backgroundFill: color.highlight.fill.discernible,
        foregroundFill: color.highlight.onFill.discernible,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an highlight-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - highlight readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightFillReadableControlTreatment: Treatment = {
    name: "color.highlight-fill-readable-control",
    properties: {
        backgroundFill: color.highlight.fill.readable,
        foregroundFill: color.highlight.onFill.readable,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an highlight-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - highlight readable foreground
 * - highlight discernible border
 *
 * @public
 */
export const highlightOutlineDiscernibleControlTreatment: Treatment = {
    name: "color.highlight-outline-discernible-control",
    properties: {
        ...densityBorder(color.highlight.stroke.discernible),
        foregroundFill: color.highlight.stroke.readable,
        backgroundFill: color.context,
    },
};

/**
 * Convenience treatment for an highlight-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - highlight readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightForegroundReadableControlTreatment: Treatment = {
    name: "color.highlight-foreground-readable-control",
    properties: {
        foregroundFill: color.highlight.stroke.readable,
    },
};

/**
 * Convenience treatment for an info-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - info stealth background
 * - info readable foreground (a11y)
 * - info safety border
 *
 * @public
 */
export const infoFillStealthControlTreatment: Treatment = {
    name: "color.info-fill-stealth-control",
    properties: {
        backgroundFill: color.info.fill.stealth,
        foregroundFill: color.info.onFill.stealth,
        ...densityBorder(color.info.stroke.safety),
    },
};

/**
 * Convenience treatment for an info-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - info subtle background
 * - info readable foreground (a11y)
 * - info safety border
 *
 * @public
 */
export const infoFillSubtleControlTreatment: Treatment = {
    name: "color.info-fill-subtle-control",
    properties: {
        backgroundFill: color.info.fill.subtle,
        foregroundFill: color.info.onFill.subtle,
        ...densityBorder(color.info.stroke.safety),
    },
};

/**
 * Convenience treatment for an info-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - info subtle inverse background
 * - info readable foreground (a11y)
 * - info safety border
 *
 * @public
 */
export const infoFillSubtleInverseControlTreatment: Treatment = {
    name: "color.info-fill-subtle-inverse-control",
    properties: {
        backgroundFill: color.info.fill.subtleInverse,
        foregroundFill: color.info.onFill.subtleInverse,
        ...densityBorder(color.info.stroke.safety),
    },
};

/**
 * Convenience treatment for an info-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - info ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoFillIdealControlTreatment: Treatment = {
    name: "color.info-fill-ideal-control",
    properties: {
        backgroundFill: color.info.fill.ideal,
        foregroundFill: color.info.onFill.ideal,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an info-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - info discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoFillDiscernibleControlTreatment: Treatment = {
    name: "color.info-fill-discernible-control",
    properties: {
        backgroundFill: color.info.fill.discernible,
        foregroundFill: color.info.onFill.discernible,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an info-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - info readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoFillReadableControlTreatment: Treatment = {
    name: "color.info-fill-readable-control",
    properties: {
        backgroundFill: color.info.fill.readable,
        foregroundFill: color.info.onFill.readable,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an info-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - info readable foreground
 * - info discernible border
 *
 * @public
 */
export const infoOutlineDiscernibleControlTreatment: Treatment = {
    name: "color.info-outline-discernible-control",
    properties: {
        ...densityBorder(color.info.stroke.discernible),
        foregroundFill: color.info.stroke.readable,
        backgroundFill: color.context,
    },
};

/**
 * Convenience treatment for an info-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - info readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoForegroundReadableControlTreatment: Treatment = {
    name: "color.info-foreground-readable-control",
    properties: {
        foregroundFill: color.info.stroke.readable,
    },
};

/**
 * Convenience treatment for an success-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - success stealth background
 * - success readable foreground (a11y)
 * - success safety border
 *
 * @public
 */
export const successFillStealthControlTreatment: Treatment = {
    name: "color.success-fill-stealth-control",
    properties: {
        backgroundFill: color.success.fill.stealth,
        foregroundFill: color.success.onFill.stealth,
        ...densityBorder(color.success.stroke.safety),
    },
};

/**
 * Convenience treatment for an success-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - success subtle background
 * - success readable foreground (a11y)
 * - success safety border
 *
 * @public
 */
export const successFillSubtleControlTreatment: Treatment = {
    name: "color.success-fill-subtle-control",
    properties: {
        backgroundFill: color.success.fill.subtle,
        foregroundFill: color.success.onFill.subtle,
        ...densityBorder(color.success.stroke.safety),
    },
};

/**
 * Convenience treatment for an success-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - success subtle inverse background
 * - success readable foreground (a11y)
 * - success safety border
 *
 * @public
 */
export const successFillSubtleInverseControlTreatment: Treatment = {
    name: "color.success-fill-subtle-inverse-control",
    properties: {
        backgroundFill: color.success.fill.subtleInverse,
        foregroundFill: color.success.onFill.subtleInverse,
        ...densityBorder(color.success.stroke.safety),
    },
};

/**
 * Convenience treatment for an success-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - success ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const successFillIdealControlTreatment: Treatment = {
    name: "color.success-fill-ideal-control",
    properties: {
        backgroundFill: color.success.fill.ideal,
        foregroundFill: color.success.onFill.ideal,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an success-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - success discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const successFillDiscernibleControlTreatment: Treatment = {
    name: "color.success-fill-discernible-control",
    properties: {
        backgroundFill: color.success.fill.discernible,
        foregroundFill: color.success.onFill.discernible,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an success-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - success readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const successFillReadableControlTreatment: Treatment = {
    name: "color.success-fill-readable-control",
    properties: {
        backgroundFill: color.success.fill.readable,
        foregroundFill: color.success.onFill.readable,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an success-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - success readable foreground
 * - success discernible border
 *
 * @public
 */
export const successOutlineDiscernibleControlTreatment: Treatment = {
    name: "color.success-outline-discernible-control",
    properties: {
        ...densityBorder(color.success.stroke.discernible),
        foregroundFill: color.success.stroke.readable,
        backgroundFill: color.context,
    },
};

/**
 * Convenience treatment for an success-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - success readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const successForegroundReadableControlTreatment: Treatment = {
    name: "color.success-foreground-readable-control",
    properties: {
        foregroundFill: color.success.stroke.readable,
    },
};

/**
 * Convenience treatment for an warning-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - warning stealth background
 * - warning readable foreground (a11y)
 * - warning safety border
 *
 * @public
 */
export const warningFillStealthControlTreatment: Treatment = {
    name: "color.warning-fill-stealth-control",
    properties: {
        backgroundFill: color.warning.fill.stealth,
        foregroundFill: color.warning.onFill.stealth,
        ...densityBorder(color.warning.stroke.safety),
    },
};

/**
 * Convenience treatment for an warning-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - warning subtle background
 * - warning readable foreground (a11y)
 * - warning safety border
 *
 * @public
 */
export const warningFillSubtleControlTreatment: Treatment = {
    name: "color.warning-fill-subtle-control",
    properties: {
        backgroundFill: color.warning.fill.subtle,
        foregroundFill: color.warning.onFill.subtle,
        ...densityBorder(color.warning.stroke.safety),
    },
};

/**
 * Convenience treatment for an warning-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - warning subtle inverse background
 * - warning readable foreground (a11y)
 * - warning safety border
 *
 * @public
 */
export const warningFillSubtleInverseControlTreatment: Treatment = {
    name: "color.warning-fill-subtle-inverse-control",
    properties: {
        backgroundFill: color.warning.fill.subtleInverse,
        foregroundFill: color.warning.onFill.subtleInverse,
        ...densityBorder(color.warning.stroke.safety),
    },
};

/**
 * Convenience treatment for an warning-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - warning ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningFillIdealControlTreatment: Treatment = {
    name: "color.warning-fill-ideal-control",
    properties: {
        backgroundFill: color.warning.fill.ideal,
        foregroundFill: color.warning.onFill.ideal,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an warning-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - warning discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningFillDiscernibleControlTreatment: Treatment = {
    name: "color.warning-fill-discernible-control",
    properties: {
        backgroundFill: color.warning.fill.discernible,
        foregroundFill: color.warning.onFill.discernible,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an warning-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - warning readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningFillReadableControlTreatment: Treatment = {
    name: "color.warning-fill-readable-control",
    properties: {
        backgroundFill: color.warning.fill.readable,
        foregroundFill: color.warning.onFill.readable,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an warning-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - warning readable foreground
 * - warning discernible border
 *
 * @public
 */
export const warningOutlineDiscernibleControlTreatment: Treatment = {
    name: "color.warning-outline-discernible-control",
    properties: {
        ...densityBorder(color.warning.stroke.discernible),
        foregroundFill: color.warning.stroke.readable,
        backgroundFill: color.context,
    },
};

/**
 * Convenience treatment for an warning-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - warning readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningForegroundReadableControlTreatment: Treatment = {
    name: "color.warning-foreground-readable-control",
    properties: {
        foregroundFill: color.warning.stroke.readable,
    },
};

/**
 * Convenience treatment for an critical-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - critical stealth background
 * - critical readable foreground (a11y)
 * - critical safety border
 *
 * @public
 */
export const criticalFillStealthControlTreatment: Treatment = {
    name: "color.critical-fill-stealth-control",
    properties: {
        backgroundFill: color.critical.fill.stealth,
        foregroundFill: color.critical.onFill.stealth,
        ...densityBorder(color.critical.stroke.safety),
    },
};

/**
 * Convenience treatment for an critical-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - critical subtle background
 * - critical readable foreground (a11y)
 * - critical safety border
 *
 * @public
 */
export const criticalFillSubtleControlTreatment: Treatment = {
    name: "color.critical-fill-subtle-control",
    properties: {
        backgroundFill: color.critical.fill.subtle,
        foregroundFill: color.critical.onFill.subtle,
        ...densityBorder(color.critical.stroke.safety),
    },
};

/**
 * Convenience treatment for an critical-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - critical subtle inverse background
 * - critical readable foreground (a11y)
 * - critical safety border
 *
 * @public
 */
export const criticalFillSubtleInverseControlTreatment: Treatment = {
    name: "color.critical-fill-subtle-inverse-control",
    properties: {
        backgroundFill: color.critical.fill.subtleInverse,
        foregroundFill: color.critical.onFill.subtleInverse,
        ...densityBorder(color.critical.stroke.safety),
    },
};

/**
 * Convenience treatment for an critical-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - critical ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalFillIdealControlTreatment: Treatment = {
    name: "color.critical-fill-ideal-control",
    properties: {
        backgroundFill: color.critical.fill.ideal,
        foregroundFill: color.critical.onFill.ideal,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an critical-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - critical discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalFillDiscernibleControlTreatment: Treatment = {
    name: "color.critical-fill-discernible-control",
    properties: {
        backgroundFill: color.critical.fill.discernible,
        foregroundFill: color.critical.onFill.discernible,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an critical-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - critical readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalFillReadableControlTreatment: Treatment = {
    name: "color.critical-fill-readable-control",
    properties: {
        backgroundFill: color.critical.fill.readable,
        foregroundFill: color.critical.onFill.readable,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for an critical-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - critical readable foreground
 * - critical discernible border
 *
 * @public
 */
export const criticalOutlineDiscernibleControlTreatment: Treatment = {
    name: "color.critical-outline-discernible-control",
    properties: {
        ...densityBorder(color.critical.stroke.discernible),
        foregroundFill: color.critical.stroke.readable,
        backgroundFill: color.context,
    },
};

/**
 * Convenience treatment for an critical-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - critical readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalForegroundReadableControlTreatment: Treatment = {
    name: "color.critical-foreground-readable-control",
    properties: {
        foregroundFill: color.critical.stroke.readable,
    },
};

/**
 * Convenience treatment for a layer-filled control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - layer interactive background
 * - neutral strong foreground (a11y)
 * - transparent border
 *
 * @public
 */
export const layerFillInteractiveControlTreatment: Treatment = {
    name: "color.layer-fill-interactive-control",
    properties: {
        backgroundFill: color.layer.fill.interactive,
        foregroundFill: color.layer.onFill.interactive,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for a neutral-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - neutral stealth background
 * - neutral strong foreground (a11y)
 * - neutral safety border
 *
 * @public
 */
export const neutralFillStealthControlTreatment: Treatment = {
    name: "color.neutral-fill-stealth-control",
    properties: {
        backgroundFill: color.neutral.fill.stealth,
        foregroundFill: color.neutral.onFill.stealth,
        ...densityBorder(color.neutral.stroke.safety),
    },
};

/**
 * Convenience treatment for a neutral-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - neutral subtle background
 * - neutral strong foreground (a11y)
 * - neutral safety border
 *
 * @public
 */
export const neutralFillSubtleControlTreatment: Treatment = {
    name: "color.neutral-fill-subtle-control",
    properties: {
        backgroundFill: color.neutral.fill.subtle,
        foregroundFill: color.neutral.onFill.subtle,
        ...densityBorder(color.neutral.stroke.safety),
    },
};

/**
 * Convenience treatment for a neutral-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - neutral subtle inverse background
 * - neutral strong foreground (a11y)
 * - neutral safety border
 *
 * @public
 */
export const neutralFillSubtleInverseControlTreatment: Treatment = {
    name: "color.neutral-fill-subtle-inverse-control",
    properties: {
        backgroundFill: color.neutral.fill.subtleInverse,
        foregroundFill: color.neutral.onFill.subtleInverse,
        ...densityBorder(color.neutral.stroke.safety),
    },
};

/**
 * Convenience treatment for an neutral-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - neutral ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralFillIdealControlTreatment: Treatment = {
    name: "color.neutral-fill-ideal-control",
    properties: {
        backgroundFill: color.neutral.fill.ideal,
        foregroundFill: color.neutral.onFill.ideal,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for a neutral-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - neutral discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralFillDiscernibleControlTreatment: Treatment = {
    name: "color.neutral-fill-discernible-control",
    properties: {
        backgroundFill: color.neutral.fill.discernible,
        foregroundFill: color.neutral.onFill.discernible,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for a neutral-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - neutral readable background
 * - neutral strong foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralFillReadableControlTreatment: Treatment = {
    name: "color.neutral-fill-readable-control",
    properties: {
        backgroundFill: color.neutral.fill.readable,
        foregroundFill: color.neutral.onFill.readable,
        ...densityBorder(transparent),
    },
};

/**
 * Convenience treatment for a neutral-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - neutral strong foreground
 * - neutral discernible border
 *
 * @public
 */
export const neutralOutlineDiscernibleControlTreatment: Treatment = {
    name: "color.neutral-outline-discernible-control",
    properties: {
        ...densityBorder(color.neutral.stroke.discernible),
        foregroundFill: { rest: color.neutral.stroke.strong, disabled: color.neutral.stroke.strong },
        backgroundFill: color.context,
    },
};

/**
 * Convenience treatment for neutral-colored hint or placeholder text or icons (not interactive).
 *
 * By default, the foreground color meets accessibility, useful for hint, placeholder, or secondary text:
 * - no background
 * - neutral readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralForegroundReadableElementTreatment: Treatment = {
    name: "color.neutral-foreground-readable-element",
    properties: {
        foregroundFill: { rest: color.neutral.stroke.readable, disabled: color.neutral.stroke.readable },
    },
};

/**
 * Convenience treatment for neutral-colored regular text or icons (not interactive).
 *
 * By default, the foreground color meets accessibility, useful for regular text:
 * - no background
 * - neutral strong foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralForegroundStrongElementTreatment: Treatment = {
    name: "color.neutral-foreground-strong-element",
    properties: {
        foregroundFill: { rest: color.neutral.stroke.strong, disabled: color.neutral.stroke.strong },
    },
};

/**
 * Convenience treatment for neutral-colored divider for presentation role.
 *
 * By default, the foreground color does not meet accessibility, useful for presentation only:
 * - no background
 * - neutral subtle foreground
 * - no border
 *
 * @public
 */
export const neutralDividerSubtleElementTreatment: Treatment = {
    name: "color.neutral-divider-subtle-element",
    properties: {
        foregroundFill: { rest: color.neutral.stroke.subtle, disabled: color.neutral.stroke.strong },
    },
};

/**
 * Convenience treatment for neutral-colored divider for separator role.
 *
 * By default, the foreground color meets accessibility, useful for semantic separation:
 * - no background
 * - neutral discernible foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralDividerDiscernibleElementTreatment: Treatment = {
    name: "color.neutral-divider-discernible-element",
    properties: {
        foregroundFill: { rest: color.neutral.stroke.discernible, disabled: color.neutral.stroke.strong },
    },
};

/**
 * Convenience treatment combining all font values for the `base` type ramp.
 *
 * @public
 */
export const typeRampBaseTreatment: Treatment = {
    name: "text.type-ramp-base",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.base,
        lineHeight: typography.ramp.default.lineHeight.base,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.base,
    },
};

/**
 * Convenience treatment combining all font values for the `minus 1` type ramp.
 *
 * @public
 */
export const typeRampMinus1Treatment: Treatment = {
    name: "text.type-ramp-minus-1",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.minus1,
        lineHeight: typography.ramp.default.lineHeight.minus1,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.minus1,
    },
};

/**
 * Convenience treatment combining all font values for the `minus 2` type ramp.
 *
 * @public
 */
export const typeRampMinus2Treatment: Treatment = {
    name: "text.type-ramp-minus-2",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.minus2,
        lineHeight: typography.ramp.default.lineHeight.minus2,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.minus2,
    },
};

/**
 * Convenience treatment combining all font values for the `plus 1` type ramp.
 *
 * @public
 */
export const typeRampPlus1Treatment: Treatment = {
    name: "text.type-ramp-plus-1",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.plus1,
        lineHeight: typography.ramp.default.lineHeight.plus1,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.plus1,
    },
};

/**
 * Convenience treatment combining all font values for the `plus 2` type ramp.
 *
 * @public
 */
export const typeRampPlus2Treatment: Treatment = {
    name: "text.type-ramp-plus-2",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.plus2,
        lineHeight: typography.ramp.default.lineHeight.plus2,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.plus2,
    },
};

/**
 * Convenience treatment combining all font values for the `plus 3` type ramp.
 *
 * @public
 */
export const typeRampPlus3Treatment: Treatment = {
    name: "text.type-ramp-plus-3",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.plus3,
        lineHeight: typography.ramp.default.lineHeight.plus3,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.plus3,
    },
};

/**
 * Convenience treatment combining all font values for the `plus 4` type ramp.
 *
 * @public
 */
export const typeRampPlus4Treatment: Treatment = {
    name: "text.type-ramp-plus-4",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.plus4,
        lineHeight: typography.ramp.default.lineHeight.plus4,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.plus4,
    },
};

/**
 * Convenience treatment combining all font values for the `plus 5` type ramp.
 *
 * @public
 */
export const typeRampPlus5Treatment: Treatment = {
    name: "text.type-ramp-plus-5",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.plus5,
        lineHeight: typography.ramp.default.lineHeight.plus5,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.plus5,
    },
};

/**
 * Convenience treatment combining all font values for the `plus 6` type ramp.
 *
 * @public
 */
export const typeRampPlus6Treatment: Treatment = {
    name: "text.type-ramp-plus-6",
    properties: {
        fontFamily: typography.fontFamily.default,
        fontSize: typography.ramp.default.fontSize.plus6,
        lineHeight: typography.ramp.default.lineHeight.plus6,
        fontWeight: typography.fontWeight.default,
        fontVariationSettings: typography.ramp.default.fontVariations.plus6,
    },
};

/**
 * @public
 */
export const shadowCardTreatment: Treatment = {
    name: "shadow.card",
    properties: {
        shadow: { rest: elevation.card.$root },
    },
};

/**
 * @public
 */
export const shadowCardInteractiveTreatment: Treatment = {
    name: "shadow.card-interactive",
    properties: {
        shadow: elevation.card.$root,
    },
};

/**
 * @public
 */
export const shadowTooltipTreatment: Treatment = {
    name: "shadow.tooltip",
    properties: {
        shadow: elevation.tooltip.$root,
    },
};

/**
 * @public
 */
export const shadowFlyoutTreatment: Treatment = {
    name: "shadow.flyout",
    properties: {
        shadow: elevation.flyout.$root,
    },
};

/**
 * @public
 */
export const shadowDialogTreatment: Treatment = {
    name: "shadow.dialog",
    properties: {
        shadow: elevation.dialog.$root,
    },
};

/**
 * @public
 */
export const actionTreatment: Treatment = {
    name: "styles.action-control",
    treatments: [
        controlShapeTreatment,
        controlDensityTreatment,
        typeRampBaseTreatment,
        neutralFillSubtleControlTreatment,
    ],
    properties: {
        ...densityBorder(color.neutral.stroke.subtle),
    },
};

/**
 * @public
 */
export const inputBaseTreatment: Treatment = {
    name: "styles.input-base",
    treatments: [
        controlShapeTreatment,
        typeRampBaseTreatment,
        neutralFillSubtleInverseControlTreatment,
    ],
    properties: {
        ...densityBorder(color.neutral.stroke.discernible),
    },
};

/**
 * @public
 */
export const inputTreatment: Treatment = {
    name: "styles.input-control",
    treatments: [
        inputBaseTreatment,
        controlDensityTreatment,
    ],
};

/**
 * @public
 */
export const inputAutofillTreatment: Treatment = {
    name: "styles.input-autofill-control",
    treatments: [
        inputBaseTreatment,
        autofillOuterDensityTreatment,
    ],
};

/**
 * @public
 */
export const selectableSelectedTreatment: Treatment = {
    name: "styles.selectable-control-selected",
    treatments: [
        controlShapeTreatment,
        typeRampBaseTreatment,
        highlightFillReadableControlTreatment,
    ],
};

/**
 * @public
 */
export const selectableUnselectedTreatment: Treatment = {
    name: "styles.selectable-control-unselected",
    treatments: [
        controlShapeTreatment,
        typeRampBaseTreatment,
        neutralOutlineDiscernibleControlTreatment,
    ],
};

/**
 * @public
 */
export const itemTreatment: Treatment = {
    name: "styles.item-control",
    treatments: [
        controlShapeTreatment,
        controlDensityTreatment,
        typeRampBaseTreatment,
        neutralFillStealthControlTreatment,
    ],
};

/**
 * @public
 */
export const plainTextTreatment: Treatment = {
    name: "styles.text-plain",
    treatments: [
        typeRampBaseTreatment,
        neutralForegroundStrongElementTreatment,
    ],
};

/**
 * @public
 */
export const plainTextMultilineTreatment: Treatment = {
    name: "styles.text-plain-multiline",
    treatments: [
        typeRampBaseTreatment,
        neutralForegroundStrongElementTreatment,
    ],
    properties: {
        lineHeight: typography.ramp.default.lineHeightMultiline.base,
    },
};

/**
 * @public
 */
export const labelTextTreatment: Treatment = {
    name: "styles.text-label",
    treatments: [
        typeRampBaseTreatment,
        neutralForegroundStrongElementTreatment,
    ],
    properties: {
        fontFamily: typography.fontFamily.label,
        fontStyle: typography.fontStyle.label,
        fontWeight: typography.fontWeight.label,
    },
};

/**
 * @public
 */
export const flyoutTreatment: Treatment = {
    name: "styles.flyout",
    treatments: [
        layerShapeTreatment,
        shadowFlyoutTreatment,
    ],
    properties: {
        backgroundFill: color.layer.fill.ramp.plus1,
    },
};

/**
 * Treatment for the disabled state.
 *
 * By default, sets the cursor to "not-allowed".
 *
 * @public
 */
export const disabledTreatment: Treatment = {
    name: "styles.disabled",
    properties: {
        cursor: "not-allowed",
    },
};

/**
 * Treatment for the interactive cursor.
 *
 * By default, sets the cursor to "pointer".
 *
 * @public
 */
export const interactiveCursorTreatment: Treatment = {
    name: "styles.interactiveCursor",
    properties: {
        cursor: "pointer",
    },
};

/**
 * @public
 */
export const focusIndicatorTreatment: Treatment = {
    name: "styles.focus-indicator",
    properties: {
        outlineColor: color.focusStroke.$root,
        outlineOffset: "1px",
        outlineStyle: "solid",
        outlineThickness: shape.strokeThickness.focus,
    },
};

/**
 * @public
 */
export const focusResetTreatment: Treatment = {
    name: "styles.focus-reset",
    properties: {
        outlineStyle: "none",
    },
};

/**
 * The treatments that the anatomy of a component applies in the reference system: the `not-allowed` cursor where it is disabled, the focus
 * indicator, and no outline on the target of a focus reset.
 *
 * @remarks
 * Expected to go with the update of the anatomy, see {@link AnatomyTreatments}.
 *
 * @beta
 */
export const referenceAnatomyTreatments: AnatomyTreatments = {
    disabled: disabledTreatment,
    focusIndicator: focusIndicatorTreatment,
    focusReset: focusResetTreatment,
};

/**
 * A mapping of the names of the reference treatments to the names of their exports.
 *
 * HACK: The full realization of design-to-code relies on generation of the styles _and_ the application to component parts.
 * This is a temporary backfill because the current variable names are not predictable, but this is cleaner in the generated
 * code than looking them up based by name.
 *
 * @beta
 */
export const TreatmentNameMapping = {
    "shape.control": "controlShapeTreatment",
    "shape.layer": "layerShapeTreatment",
    "shape.round": "roundShapeTreatment",
    "density.control": "controlDensityTreatment",
    "density.control-square": "controlSquareDensityTreatment",
    "density.autofill-outer": "autofillOuterDensityTreatment",
    "density.autofill-inner": "autofillInnerDensityTreatment",
    "density.control-list": "controlListDensityTreatment",
    "density.item-container": "controlListDensityTreatment",
    "density.layer": "layerDensityTreatment",
    "color.accent-fill-stealth-control": "accentFillStealthControlTreatment",
    "color.accent-fill-subtle-control": "accentFillSubtleControlTreatment",
    "color.accent-fill-subtle-inverse-control": "accentFillSubtleInverseControlTreatment",
    "color.accent-fill-ideal-control": "accentFillIdealControlTreatment",
    "color.accent-fill-discernible-control": "accentFillDiscernibleControlTreatment",
    "color.accent-fill-readable-control": "accentFillReadableControlTreatment",
    "color.accent-outline-discernible-control": "accentOutlineDiscernibleControlTreatment",
    "color.accent-foreground-readable-control": "accentForegroundReadableControlTreatment",
    "color.highlight-fill-stealth-control": "highlightFillStealthControlTreatment",
    "color.highlight-fill-subtle-control": "highlightFillSubtleControlTreatment",
    "color.highlight-fill-subtle-inverse-control": "highlightFillSubtleInverseControlTreatment",
    "color.highlight-fill-ideal-control": "highlightFillIdealControlTreatment",
    "color.highlight-fill-discernible-control": "highlightFillDiscernibleControlTreatment",
    "color.highlight-fill-readable-control": "highlightFillReadableControlTreatment",
    "color.highlight-outline-discernible-control": "highlightOutlineDiscernibleControlTreatment",
    "color.highlight-foreground-readable-control": "highlightForegroundReadableControlTreatment",
    "color.info-fill-stealth-control": "infoFillStealthControlTreatment",
    "color.info-fill-subtle-control": "infoFillSubtleControlTreatment",
    "color.info-fill-subtle-inverse-control": "infoFillSubtleInverseControlTreatment",
    "color.info-fill-ideal-control": "infoFillIdealControlTreatment",
    "color.info-fill-discernible-control": "infoFillDiscernibleControlTreatment",
    "color.info-fill-readable-control": "infoFillReadableControlTreatment",
    "color.info-outline-discernible-control": "infoOutlineDiscernibleControlTreatment",
    "color.info-foreground-readable-control": "infoForegroundReadableControlTreatment",
    "color.success-fill-stealth-control": "successFillStealthControlTreatment",
    "color.success-fill-subtle-control": "successFillSubtleControlTreatment",
    "color.success-fill-subtle-inverse-control": "successFillSubtleInverseControlTreatment",
    "color.success-fill-ideal-control": "successFillIdealControlTreatment",
    "color.success-fill-discernible-control": "successFillDiscernibleControlTreatment",
    "color.success-fill-readable-control": "successFillReadableControlTreatment",
    "color.success-outline-discernible-control": "successOutlineDiscernibleControlTreatment",
    "color.success-foreground-readable-control": "successForegroundReadableControlTreatment",
    "color.warning-fill-stealth-control": "warningFillStealthControlTreatment",
    "color.warning-fill-subtle-control": "warningFillSubtleControlTreatment",
    "color.warning-fill-subtle-inverse-control": "warningFillSubtleInverseControlTreatment",
    "color.warning-fill-ideal-control": "warningFillIdealControlTreatment",
    "color.warning-fill-discernible-control": "warningFillDiscernibleControlTreatment",
    "color.warning-fill-readable-control": "warningFillReadableControlTreatment",
    "color.warning-outline-discernible-control": "warningOutlineDiscernibleControlTreatment",
    "color.warning-foreground-readable-control": "warningForegroundReadableControlTreatment",
    "color.critical-fill-stealth-control": "criticalFillStealthControlTreatment",
    "color.critical-fill-subtle-control": "criticalFillSubtleControlTreatment",
    "color.critical-fill-subtle-inverse-control": "criticalFillSubtleInverseControlTreatment",
    "color.critical-fill-ideal-control": "criticalFillIdealControlTreatment",
    "color.critical-fill-discernible-control": "criticalFillDiscernibleControlTreatment",
    "color.critical-fill-readable-control": "criticalFillReadableControlTreatment",
    "color.critical-outline-discernible-control": "criticalOutlineDiscernibleControlTreatment",
    "color.critical-foreground-readable-control": "criticalForegroundReadableControlTreatment",
    "color.neutral-fill-stealth-control": "neutralFillStealthControlTreatment",
    "color.neutral-fill-subtle-control": "neutralFillSubtleControlTreatment",
    "color.neutral-fill-subtle-inverse-control": "neutralFillSubtleInverseControlTreatment",
    "color.neutral-fill-ideal-control": "neutralFillIdealControlTreatment",
    "color.neutral-fill-discernible-control": "neutralFillDiscernibleControlTreatment",
    "color.neutral-fill-readable-control": "neutralFillReadableControlTreatment",
    "color.neutral-outline-discernible-control": "neutralOutlineDiscernibleControlTreatment",
    "color.neutral-foreground-readable-element": "neutralForegroundReadableElementTreatment",
    "color.neutral-foreground-strong-element": "neutralForegroundStrongElementTreatment",
    "color.neutral-divider-subtle-element": "neutralDividerSubtleElementTreatment",
    "color.neutral-divider-discernible-element": "neutralDividerDiscernibleElementTreatment",
    "text.type-ramp-base": "typeRampBaseTreatment",
    "text.type-ramp-minus-1": "typeRampMinus1Treatment",
    "text.type-ramp-minus-2": "typeRampMinus2Treatment",
    "text.type-ramp-plus-1": "typeRampPlus1Treatment",
    "text.type-ramp-plus-2": "typeRampPlus2Treatment",
    "text.type-ramp-plus-3": "typeRampPlus3Treatment",
    "text.type-ramp-plus-4": "typeRampPlus4Treatment",
    "text.type-ramp-plus-5": "typeRampPlus5Treatment",
    "text.type-ramp-plus-6": "typeRampPlus6Treatment",
    "shadow.card": "shadowCardTreatment",
    "shadow.card-interactive": "shadowCardInteractiveTreatment",
    "shadow.tooltip": "shadowTooltipTreatment",
    "shadow.flyout": "shadowFlyoutTreatment",
    "shadow.dialog": "shadowDialogTreatment",
    "styles.action-control": "actionTreatment",
    "styles.input-base": "inputBaseTreatment",
    "styles.input-control": "inputTreatment",
    "styles.input-autofill-control": "inputAutofillTreatment",
    "styles.selectable-control-selected": "selectableSelectedTreatment",
    "styles.selectable-control-unselected": "selectableUnselectedTreatment",
    "styles.item-control": "itemTreatment",
    "styles.text-plain": "plainTextTreatment",
    "styles.text-label": "labelTextTreatment",
    "styles.flyout": "flyoutTreatment",
    "styles.disabled": "disabledTreatment",
    "styles.focus-indicator": "focusIndicatorTreatment",
    "styles.focus-reset": "focusResetTreatment",
};

export type TreatmentNameMapping = (typeof TreatmentNameMapping)[keyof typeof TreatmentNameMapping];

/**
 * The treatments of the reference system, which an anatomy written as data refers to by name.
 *
 * @public
 */
export const referenceTreatments: readonly Treatment[] = [
    controlShapeTreatment,
    layerShapeTreatment,
    roundShapeTreatment,
    textDensityTreatment,
    controlDensityTreatment,
    controlSquareDensityTreatment,
    autofillOuterDensityTreatment,
    autofillInnerDensityTreatment,
    controlListDensityTreatment,
    layerDensityTreatment,
    accentFillStealthControlTreatment,
    accentFillSubtleControlTreatment,
    accentFillSubtleInverseControlTreatment,
    accentFillIdealControlTreatment,
    accentFillDiscernibleControlTreatment,
    accentFillReadableControlTreatment,
    accentOutlineDiscernibleControlTreatment,
    accentForegroundReadableControlTreatment,
    highlightFillStealthControlTreatment,
    highlightFillSubtleControlTreatment,
    highlightFillSubtleInverseControlTreatment,
    highlightFillIdealControlTreatment,
    highlightFillDiscernibleControlTreatment,
    highlightFillReadableControlTreatment,
    highlightOutlineDiscernibleControlTreatment,
    highlightForegroundReadableControlTreatment,
    infoFillStealthControlTreatment,
    infoFillSubtleControlTreatment,
    infoFillSubtleInverseControlTreatment,
    infoFillIdealControlTreatment,
    infoFillDiscernibleControlTreatment,
    infoFillReadableControlTreatment,
    infoOutlineDiscernibleControlTreatment,
    infoForegroundReadableControlTreatment,
    successFillStealthControlTreatment,
    successFillSubtleControlTreatment,
    successFillSubtleInverseControlTreatment,
    successFillIdealControlTreatment,
    successFillDiscernibleControlTreatment,
    successFillReadableControlTreatment,
    successOutlineDiscernibleControlTreatment,
    successForegroundReadableControlTreatment,
    warningFillStealthControlTreatment,
    warningFillSubtleControlTreatment,
    warningFillSubtleInverseControlTreatment,
    warningFillIdealControlTreatment,
    warningFillDiscernibleControlTreatment,
    warningFillReadableControlTreatment,
    warningOutlineDiscernibleControlTreatment,
    warningForegroundReadableControlTreatment,
    criticalFillStealthControlTreatment,
    criticalFillSubtleControlTreatment,
    criticalFillSubtleInverseControlTreatment,
    criticalFillIdealControlTreatment,
    criticalFillDiscernibleControlTreatment,
    criticalFillReadableControlTreatment,
    criticalOutlineDiscernibleControlTreatment,
    criticalForegroundReadableControlTreatment,
    layerFillInteractiveControlTreatment,
    neutralFillStealthControlTreatment,
    neutralFillSubtleControlTreatment,
    neutralFillSubtleInverseControlTreatment,
    neutralFillIdealControlTreatment,
    neutralFillDiscernibleControlTreatment,
    neutralFillReadableControlTreatment,
    neutralOutlineDiscernibleControlTreatment,
    neutralForegroundReadableElementTreatment,
    neutralForegroundStrongElementTreatment,
    neutralDividerSubtleElementTreatment,
    neutralDividerDiscernibleElementTreatment,
    typeRampBaseTreatment,
    typeRampMinus1Treatment,
    typeRampMinus2Treatment,
    typeRampPlus1Treatment,
    typeRampPlus2Treatment,
    typeRampPlus3Treatment,
    typeRampPlus4Treatment,
    typeRampPlus5Treatment,
    typeRampPlus6Treatment,
    shadowCardTreatment,
    shadowCardInteractiveTreatment,
    shadowTooltipTreatment,
    shadowFlyoutTreatment,
    shadowDialogTreatment,
    actionTreatment,
    inputBaseTreatment,
    inputTreatment,
    inputAutofillTreatment,
    selectableSelectedTreatment,
    selectableUnselectedTreatment,
    itemTreatment,
    plainTextTreatment,
    plainTextMultilineTreatment,
    labelTextTreatment,
    flyoutTreatment,
    disabledTreatment,
    interactiveCursorTreatment,
    focusIndicatorTreatment,
    focusResetTreatment,
];
