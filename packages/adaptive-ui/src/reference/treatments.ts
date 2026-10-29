import { Library, refs } from "design-token-library";
import type { AnatomyTreatments } from "../core/styles/css/style-rules.js";
import { OnFill, onFill } from "../core/styles/on-fill.js";
import { treatment, TreatmentToken } from "../core/styles/treatment-token.js";
import type { ReferenceLibraryTokens } from "./library.js";
import { densityBorder, transparent } from "./util.js";

/**
 * The treatments of the reference system, as tokens in the tree of the tokens they style.
 *
 * @remarks
 * A treatment is named by one of two patterns, with the word in its path, so it isn't taken for a token:
 *
 * - The treatment of a set of tokens is the set's `treatment`, beside its tokens, like `density.control.treatment`. When it has variants,
 *   `treatment` is a group whose `$root` is the treatment and whose children are the variants, like `density.control.treatment.square`.
 *
 * - The other treatments of a group are in its `treatments` group, like `color.accent.treatments.fillReadableControl`, and those composed
 *   across the groups are in the `treatments` group of the root, like `treatments.actionControl`.
 *
 * Each has its name of 0.14 as a former name. The experimental treatments are in `experimental.ts`, with the experimental tokens. Why a
 * treatment is a token: `docs/decisions/0015-a-treatment-is-a-token.md`.
 *
 * @public
 */
export interface ReferenceTreatmentTokens {
    shape: {
        treatments: {
            control: TreatmentToken;
            layer: TreatmentToken;
            round: TreatmentToken;
        };
    };
    density: {
        text: {
            treatment: TreatmentToken;
        };
        control: {
            treatment: {
                $root: TreatmentToken;
                square: TreatmentToken;
                autofillOuter: TreatmentToken;
                autofillInner: TreatmentToken;
            };
        };
        controlList: {
            treatment: TreatmentToken;
        };
        layer: {
            treatment: TreatmentToken;
        };
    };
    color: {
        accent: {
            treatments: {
                fillStealthControl: TreatmentToken;
                fillSubtleControl: TreatmentToken;
                fillSubtleInverseControl: TreatmentToken;
                fillIdealControl: TreatmentToken;
                fillDiscernibleControl: TreatmentToken;
                fillReadableControl: TreatmentToken;
                outlineDiscernibleControl: TreatmentToken;
                foregroundReadableControl: TreatmentToken;
            };
        };
        highlight: {
            treatments: {
                fillStealthControl: TreatmentToken;
                fillSubtleControl: TreatmentToken;
                fillSubtleInverseControl: TreatmentToken;
                fillIdealControl: TreatmentToken;
                fillDiscernibleControl: TreatmentToken;
                fillReadableControl: TreatmentToken;
                outlineDiscernibleControl: TreatmentToken;
                foregroundReadableControl: TreatmentToken;
            };
        };
        info: {
            treatments: {
                fillStealthControl: TreatmentToken;
                fillSubtleControl: TreatmentToken;
                fillSubtleInverseControl: TreatmentToken;
                fillIdealControl: TreatmentToken;
                fillDiscernibleControl: TreatmentToken;
                fillReadableControl: TreatmentToken;
                outlineDiscernibleControl: TreatmentToken;
                foregroundReadableControl: TreatmentToken;
            };
        };
        success: {
            treatments: {
                fillStealthControl: TreatmentToken;
                fillSubtleControl: TreatmentToken;
                fillSubtleInverseControl: TreatmentToken;
                fillIdealControl: TreatmentToken;
                fillDiscernibleControl: TreatmentToken;
                fillReadableControl: TreatmentToken;
                outlineDiscernibleControl: TreatmentToken;
                foregroundReadableControl: TreatmentToken;
            };
        };
        warning: {
            treatments: {
                fillStealthControl: TreatmentToken;
                fillSubtleControl: TreatmentToken;
                fillSubtleInverseControl: TreatmentToken;
                fillIdealControl: TreatmentToken;
                fillDiscernibleControl: TreatmentToken;
                fillReadableControl: TreatmentToken;
                outlineDiscernibleControl: TreatmentToken;
                foregroundReadableControl: TreatmentToken;
            };
        };
        critical: {
            treatments: {
                fillStealthControl: TreatmentToken;
                fillSubtleControl: TreatmentToken;
                fillSubtleInverseControl: TreatmentToken;
                fillIdealControl: TreatmentToken;
                fillDiscernibleControl: TreatmentToken;
                fillReadableControl: TreatmentToken;
                outlineDiscernibleControl: TreatmentToken;
                foregroundReadableControl: TreatmentToken;
            };
        };
        layer: {
            treatments: {
                fillInteractiveControl: TreatmentToken;
            };
        };
        neutral: {
            treatments: {
                fillStealthControl: TreatmentToken;
                fillSubtleControl: TreatmentToken;
                fillSubtleInverseControl: TreatmentToken;
                fillIdealControl: TreatmentToken;
                fillDiscernibleControl: TreatmentToken;
                fillReadableControl: TreatmentToken;
                outlineDiscernibleControl: TreatmentToken;
                foregroundReadableElement: TreatmentToken;
                foregroundStrongElement: TreatmentToken;
                dividerSubtleElement: TreatmentToken;
                dividerDiscernibleElement: TreatmentToken;
            };
        };
    };
    typography: {
        ramp: {
            default: {
                treatments: {
                    base: TreatmentToken;
                    minus1: TreatmentToken;
                    minus2: TreatmentToken;
                    plus1: TreatmentToken;
                    plus2: TreatmentToken;
                    plus3: TreatmentToken;
                    plus4: TreatmentToken;
                    plus5: TreatmentToken;
                    plus6: TreatmentToken;
                };
            };
        };
    };
    elevation: {
        card: {
            treatment: {
                $root: TreatmentToken;
                interactive: TreatmentToken;
            };
        };
        tooltip: {
            treatment: TreatmentToken;
        };
        flyout: {
            treatment: TreatmentToken;
        };
        dialog: {
            treatment: TreatmentToken;
        };
    };
    treatments: {
        actionControl: TreatmentToken;
        inputBase: TreatmentToken;
        inputControl: TreatmentToken;
        inputAutofillControl: TreatmentToken;
        selectableControlSelected: TreatmentToken;
        selectableControlUnselected: TreatmentToken;
        itemControl: TreatmentToken;
        textPlain: TreatmentToken;
        textPlainMultiline: TreatmentToken;
        textLabel: TreatmentToken;
        flyout: TreatmentToken;
        disabled: TreatmentToken;
        interactiveCursor: TreatmentToken;
        focusIndicator: TreatmentToken;
        focusReset: TreatmentToken;
    };
}

const tokens = refs<ReferenceLibraryTokens>();
const { color, density, elevation, shape, typography } = tokens;

// Black or white on the fill of the treatment, which doesn't flip in the active state when the rest and the hover are the same, as in 0.14.
const blackOrWhiteOnFill = (token: OnFill["token"]): OnFill => onFill(token, { activeFollowsRest: true });

/**
 * The configuration of the treatments of the reference system, for the library, which the reference library puts in the groups they are
 * named in.
 *
 * @public
 */
export const treatments: Library.Config<ReferenceTreatmentTokens, ReferenceLibraryTokens> = {
    shape: {
        treatments: {
            /**
             * Treatment for the shape of a control.
             *
             * By default, sets the border radius, useful for buttons, inputs, list items, etc.
             */
            control: treatment(
                {
                    properties: {
                        cornerRadius: shape.cornerRadius.default,
                    },
                },
                { formerNames: ["shape.control"] }
            ),
            /**
             * Treatment for the shape of a layer.
             *
             * By default, sets the border radius, useful for card, panes, etc.
             */
            layer: treatment(
                {
                    properties: {
                        cornerRadius: shape.cornerRadius.layer,
                    },
                },
                { formerNames: ["shape.layer"] }
            ),
            /**
             * Treatment for the shape of a rounded control (pill shape).
             *
             * By default, sets the border radius, useful for badge, radio, etc.
             */
            round: treatment(
                {
                    properties: {
                        cornerRadius: "999px",
                    },
                },
                { formerNames: ["shape.round"] }
            ),
        },
    },
    density: {
        text: {
            /**
             * Treatment for the density and spacing of plain text.
             *
             * By default, sets the padding and gap, useful for label and value pairs or stacked lines of text.
             */
            treatment: treatment(
                {
                    properties: {
                        paddingHorizontal: density.text.horizontal.padding,
                        paddingVertical: density.text.vertical.padding,
                        gap: density.text.horizontal.gap,
                    },
                },
                { formerNames: ["density.text"] }
            ),
        },
        control: {
            treatment: {
                /**
                 * Treatment for the density and spacing of a control.
                 *
                 * By default, sets the padding and gap, useful for buttons, list items, etc.
                 *
                 * See {@link autofillOuterDensityTreatment} or {@link controlListDensityTreatment}.
                 */
                $root: treatment(
                    {
                        properties: {
                            paddingHorizontal: density.control.horizontal.padding,
                            paddingVertical: density.control.vertical.padding,
                            gap: density.control.horizontal.gap,
                        },
                    },
                    { formerNames: ["density.control"] }
                ),
                /**
                 * Treatment for the density and spacing of a *square* control.
                 *
                 * By default, sets the padding and gap, useful for icon-only buttons or other elements which should be square based on vertical size.
                 *
                 * See {@link autofillOuterDensityTreatment} or {@link controlListDensityTreatment}.
                 */
                square: treatment(
                    {
                        properties: {
                            padding: density.control.vertical.padding,
                            gap: density.control.horizontal.gap,
                        },
                    },
                    { formerNames: ["density.control-square"] }
                ),
                /**
                 * Treatment pair (outer portion) for input controls that support autofill to allow for better handling of platform styling.
                 *
                 * By default, sets the horizontal padding and gap, useful for the container of wrapped inputs like text field.
                 *
                 * See {@link autofillInnerDensityTreatment}.
                 */
                autofillOuter: treatment(
                    {
                        properties: {
                            paddingTop: "0",
                            paddingRight: density.control.horizontal.padding,
                            paddingBottom: "0",
                            paddingLeft: density.control.horizontal.padding,
                            gap: density.control.horizontal.gap,
                        },
                    },
                    { formerNames: ["density.autofill-outer"] }
                ),
                /**
                 * Treatment pair (inner portion) for input controls that support autofill to allow for better handling of platform styling.
                 *
                 * By default, sets the vertical padding, useful for wrapped inputs like text field.
                 *
                 * See {@link autofillOuterDensityTreatment}.
                 */
                autofillInner: treatment(
                    {
                        properties: {
                            paddingTop: density.control.vertical.padding,
                            paddingRight: "0",
                            paddingBottom: density.control.vertical.padding,
                            paddingLeft: "0",
                        },
                    },
                    { formerNames: ["density.autofill-inner"] }
                ),
            },
        },
        controlList: {
            /**
             * Treatment for the density and spacing of a list of controls.
             *
             * By default, sets the padding and gap, useful for menus, lists of buttons, etc.
             */
            treatment: treatment(
                {
                    properties: {
                        paddingHorizontal: density.controlList.horizontal.padding,
                        paddingVertical: density.controlList.vertical.padding,
                        gap: density.controlList.horizontal.gap,
                    },
                },
                { formerNames: ["density.control-list", "density.item-container"] }
            ),
        },
        layer: {
            /**
             * Treatment for the density and spacing of a layer.
             *
             * By default, sets the padding and gap, useful for cards, dialogs, etc.
             */
            treatment: treatment(
                {
                    properties: {
                        paddingHorizontal: density.layer.horizontal.padding,
                        paddingVertical: density.layer.vertical.padding,
                        gap: density.layer.horizontal.gap,
                    },
                },
                { formerNames: ["density.layer"] }
            ),
        },
    },
    color: {
        accent: {
            treatments: {
                /**
                 * Convenience treatment for an accent-filled stealth control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - accent stealth background
                 * - accent readable foreground (a11y)
                 * - accent safety border
                 */
                fillStealthControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.accent.fill.stealth,
                            foregroundFill: onFill(color.accent.stroke.readable),
                            ...densityBorder(color.accent.stroke.safety),
                        },
                    },
                    { formerNames: ["color.accent-fill-stealth-control"] }
                ),
                /**
                 * Convenience treatment for an accent-filled subtle control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - accent subtle background
                 * - accent readable foreground (a11y)
                 * - accent safety border
                 */
                fillSubtleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.accent.fill.subtle,
                            foregroundFill: onFill(color.accent.stroke.readable),
                            ...densityBorder(color.accent.stroke.safety),
                        },
                    },
                    { formerNames: ["color.accent-fill-subtle-control"] }
                ),
                /**
                 * Convenience treatment for an accent-filled subtle inverse control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - accent subtle inverse background
                 * - accent readable foreground (a11y)
                 * - accent safety border
                 */
                fillSubtleInverseControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.accent.fill.subtleInverse,
                            foregroundFill: onFill(color.accent.stroke.readable),
                            ...densityBorder(color.accent.stroke.safety),
                        },
                    },
                    { formerNames: ["color.accent-fill-subtle-inverse-control"] }
                ),
                /**
                 * Convenience treatment for an accent-filled ideal control (interactive).
                 *
                 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
                 * - accent ideal background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillIdealControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.accent.fill.ideal,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.accent-fill-ideal-control"] }
                ),
                /**
                 * Convenience treatment for an accent-filled discernible control (interactive).
                 *
                 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
                 * - accent discernible background (a11y)
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillDiscernibleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.accent.fill.discernible,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.discernible),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.accent-fill-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an accent-filled readable control (interactive).
                 *
                 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
                 * - accent readable background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillReadableControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.accent.fill.readable,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.accent-fill-readable-control"] }
                ),
                /**
                 * Convenience treatment for an accent-outlined discernible control (interactive).
                 *
                 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
                 * - fill color background
                 * - accent readable foreground
                 * - accent discernible border
                 */
                outlineDiscernibleControl: treatment(
                    {
                        properties: {
                            ...densityBorder(color.accent.stroke.discernible),
                            foregroundFill: color.accent.stroke.readable,
                            backgroundFill: color.context,
                        },
                    },
                    { formerNames: ["color.accent-outline-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an accent-colored text or icon control (interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for a link, or similar:
                 * - no background
                 * - accent readable foreground (a11y)
                 * - no border
                 */
                foregroundReadableControl: treatment(
                    {
                        properties: {
                            foregroundFill: color.accent.stroke.readable,
                        },
                    },
                    { formerNames: ["color.accent-foreground-readable-control"] }
                ),
            },
        },
        highlight: {
            treatments: {
                /**
                 * Convenience treatment for an highlight-filled stealth control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - highlight stealth background
                 * - highlight readable foreground (a11y)
                 * - highlight safety border
                 */
                fillStealthControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.highlight.fill.stealth,
                            foregroundFill: onFill(color.highlight.stroke.readable),
                            ...densityBorder(color.highlight.stroke.safety),
                        },
                    },
                    { formerNames: ["color.highlight-fill-stealth-control"] }
                ),
                /**
                 * Convenience treatment for an highlight-filled subtle control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - highlight subtle background
                 * - highlight readable foreground (a11y)
                 * - highlight safety border
                 */
                fillSubtleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.highlight.fill.subtle,
                            foregroundFill: onFill(color.highlight.stroke.readable),
                            ...densityBorder(color.highlight.stroke.safety),
                        },
                    },
                    { formerNames: ["color.highlight-fill-subtle-control"] }
                ),
                /**
                 * Convenience treatment for an highlight-filled subtle inverse control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - highlight subtle inverse background
                 * - highlight readable foreground (a11y)
                 * - highlight safety border
                 */
                fillSubtleInverseControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.highlight.fill.subtleInverse,
                            foregroundFill: onFill(color.highlight.stroke.readable),
                            ...densityBorder(color.highlight.stroke.safety),
                        },
                    },
                    { formerNames: ["color.highlight-fill-subtle-inverse-control"] }
                ),
                /**
                 * Convenience treatment for an highlight-filled ideal control (interactive).
                 *
                 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
                 * - highlight ideal background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillIdealControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.highlight.fill.ideal,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.highlight-fill-ideal-control"] }
                ),
                /**
                 * Convenience treatment for an highlight-filled discernible control (interactive).
                 *
                 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
                 * - highlight discernible background (a11y)
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillDiscernibleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.highlight.fill.discernible,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.discernible),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.highlight-fill-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an highlight-filled readable control (interactive).
                 *
                 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
                 * - highlight readable background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillReadableControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.highlight.fill.readable,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.highlight-fill-readable-control"] }
                ),
                /**
                 * Convenience treatment for an highlight-outlined discernible control (interactive).
                 *
                 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
                 * - fill color background
                 * - highlight readable foreground
                 * - highlight discernible border
                 */
                outlineDiscernibleControl: treatment(
                    {
                        properties: {
                            ...densityBorder(color.highlight.stroke.discernible),
                            foregroundFill: color.highlight.stroke.readable,
                            backgroundFill: color.context,
                        },
                    },
                    { formerNames: ["color.highlight-outline-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an highlight-colored text or icon control (interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for a link, or similar:
                 * - no background
                 * - highlight readable foreground (a11y)
                 * - no border
                 */
                foregroundReadableControl: treatment(
                    {
                        properties: {
                            foregroundFill: color.highlight.stroke.readable,
                        },
                    },
                    { formerNames: ["color.highlight-foreground-readable-control"] }
                ),
            },
        },
        info: {
            treatments: {
                /**
                 * Convenience treatment for an info-filled stealth control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - info stealth background
                 * - info readable foreground (a11y)
                 * - info safety border
                 */
                fillStealthControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.info.fill.stealth,
                            foregroundFill: onFill(color.info.stroke.readable),
                            ...densityBorder(color.info.stroke.safety),
                        },
                    },
                    { formerNames: ["color.info-fill-stealth-control"] }
                ),
                /**
                 * Convenience treatment for an info-filled subtle control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - info subtle background
                 * - info readable foreground (a11y)
                 * - info safety border
                 */
                fillSubtleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.info.fill.subtle,
                            foregroundFill: onFill(color.info.stroke.readable),
                            ...densityBorder(color.info.stroke.safety),
                        },
                    },
                    { formerNames: ["color.info-fill-subtle-control"] }
                ),
                /**
                 * Convenience treatment for an info-filled subtle inverse control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - info subtle inverse background
                 * - info readable foreground (a11y)
                 * - info safety border
                 */
                fillSubtleInverseControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.info.fill.subtleInverse,
                            foregroundFill: onFill(color.info.stroke.readable),
                            ...densityBorder(color.info.stroke.safety),
                        },
                    },
                    { formerNames: ["color.info-fill-subtle-inverse-control"] }
                ),
                /**
                 * Convenience treatment for an info-filled ideal control (interactive).
                 *
                 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
                 * - info ideal background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillIdealControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.info.fill.ideal,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.info-fill-ideal-control"] }
                ),
                /**
                 * Convenience treatment for an info-filled discernible control (interactive).
                 *
                 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
                 * - info discernible background (a11y)
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillDiscernibleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.info.fill.discernible,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.discernible),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.info-fill-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an info-filled readable control (interactive).
                 *
                 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
                 * - info readable background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillReadableControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.info.fill.readable,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.info-fill-readable-control"] }
                ),
                /**
                 * Convenience treatment for an info-outlined discernible control (interactive).
                 *
                 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
                 * - fill color background
                 * - info readable foreground
                 * - info discernible border
                 */
                outlineDiscernibleControl: treatment(
                    {
                        properties: {
                            ...densityBorder(color.info.stroke.discernible),
                            foregroundFill: color.info.stroke.readable,
                            backgroundFill: color.context,
                        },
                    },
                    { formerNames: ["color.info-outline-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an info-colored text or icon control (interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for a link, or similar:
                 * - no background
                 * - info readable foreground (a11y)
                 * - no border
                 */
                foregroundReadableControl: treatment(
                    {
                        properties: {
                            foregroundFill: color.info.stroke.readable,
                        },
                    },
                    { formerNames: ["color.info-foreground-readable-control"] }
                ),
            },
        },
        success: {
            treatments: {
                /**
                 * Convenience treatment for an success-filled stealth control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - success stealth background
                 * - success readable foreground (a11y)
                 * - success safety border
                 */
                fillStealthControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.success.fill.stealth,
                            foregroundFill: onFill(color.success.stroke.readable),
                            ...densityBorder(color.success.stroke.safety),
                        },
                    },
                    { formerNames: ["color.success-fill-stealth-control"] }
                ),
                /**
                 * Convenience treatment for an success-filled subtle control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - success subtle background
                 * - success readable foreground (a11y)
                 * - success safety border
                 */
                fillSubtleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.success.fill.subtle,
                            foregroundFill: onFill(color.success.stroke.readable),
                            ...densityBorder(color.success.stroke.safety),
                        },
                    },
                    { formerNames: ["color.success-fill-subtle-control"] }
                ),
                /**
                 * Convenience treatment for an success-filled subtle inverse control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - success subtle inverse background
                 * - success readable foreground (a11y)
                 * - success safety border
                 */
                fillSubtleInverseControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.success.fill.subtleInverse,
                            foregroundFill: onFill(color.success.stroke.readable),
                            ...densityBorder(color.success.stroke.safety),
                        },
                    },
                    { formerNames: ["color.success-fill-subtle-inverse-control"] }
                ),
                /**
                 * Convenience treatment for an success-filled ideal control (interactive).
                 *
                 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
                 * - success ideal background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillIdealControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.success.fill.ideal,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.success-fill-ideal-control"] }
                ),
                /**
                 * Convenience treatment for an success-filled discernible control (interactive).
                 *
                 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
                 * - success discernible background (a11y)
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillDiscernibleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.success.fill.discernible,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.discernible),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.success-fill-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an success-filled readable control (interactive).
                 *
                 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
                 * - success readable background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillReadableControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.success.fill.readable,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.success-fill-readable-control"] }
                ),
                /**
                 * Convenience treatment for an success-outlined discernible control (interactive).
                 *
                 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
                 * - fill color background
                 * - success readable foreground
                 * - success discernible border
                 */
                outlineDiscernibleControl: treatment(
                    {
                        properties: {
                            ...densityBorder(color.success.stroke.discernible),
                            foregroundFill: color.success.stroke.readable,
                            backgroundFill: color.context,
                        },
                    },
                    { formerNames: ["color.success-outline-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an success-colored text or icon control (interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for a link, or similar:
                 * - no background
                 * - success readable foreground (a11y)
                 * - no border
                 */
                foregroundReadableControl: treatment(
                    {
                        properties: {
                            foregroundFill: color.success.stroke.readable,
                        },
                    },
                    { formerNames: ["color.success-foreground-readable-control"] }
                ),
            },
        },
        warning: {
            treatments: {
                /**
                 * Convenience treatment for an warning-filled stealth control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - warning stealth background
                 * - warning readable foreground (a11y)
                 * - warning safety border
                 */
                fillStealthControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.warning.fill.stealth,
                            foregroundFill: onFill(color.warning.stroke.readable),
                            ...densityBorder(color.warning.stroke.safety),
                        },
                    },
                    { formerNames: ["color.warning-fill-stealth-control"] }
                ),
                /**
                 * Convenience treatment for an warning-filled subtle control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - warning subtle background
                 * - warning readable foreground (a11y)
                 * - warning safety border
                 */
                fillSubtleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.warning.fill.subtle,
                            foregroundFill: onFill(color.warning.stroke.readable),
                            ...densityBorder(color.warning.stroke.safety),
                        },
                    },
                    { formerNames: ["color.warning-fill-subtle-control"] }
                ),
                /**
                 * Convenience treatment for an warning-filled subtle inverse control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - warning subtle inverse background
                 * - warning readable foreground (a11y)
                 * - warning safety border
                 */
                fillSubtleInverseControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.warning.fill.subtleInverse,
                            foregroundFill: onFill(color.warning.stroke.readable),
                            ...densityBorder(color.warning.stroke.safety),
                        },
                    },
                    { formerNames: ["color.warning-fill-subtle-inverse-control"] }
                ),
                /**
                 * Convenience treatment for an warning-filled ideal control (interactive).
                 *
                 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
                 * - warning ideal background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillIdealControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.warning.fill.ideal,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.warning-fill-ideal-control"] }
                ),
                /**
                 * Convenience treatment for an warning-filled discernible control (interactive).
                 *
                 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
                 * - warning discernible background (a11y)
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillDiscernibleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.warning.fill.discernible,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.discernible),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.warning-fill-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an warning-filled readable control (interactive).
                 *
                 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
                 * - warning readable background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillReadableControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.warning.fill.readable,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.warning-fill-readable-control"] }
                ),
                /**
                 * Convenience treatment for an warning-outlined discernible control (interactive).
                 *
                 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
                 * - fill color background
                 * - warning readable foreground
                 * - warning discernible border
                 */
                outlineDiscernibleControl: treatment(
                    {
                        properties: {
                            ...densityBorder(color.warning.stroke.discernible),
                            foregroundFill: color.warning.stroke.readable,
                            backgroundFill: color.context,
                        },
                    },
                    { formerNames: ["color.warning-outline-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an warning-colored text or icon control (interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for a link, or similar:
                 * - no background
                 * - warning readable foreground (a11y)
                 * - no border
                 */
                foregroundReadableControl: treatment(
                    {
                        properties: {
                            foregroundFill: color.warning.stroke.readable,
                        },
                    },
                    { formerNames: ["color.warning-foreground-readable-control"] }
                ),
            },
        },
        critical: {
            treatments: {
                /**
                 * Convenience treatment for an critical-filled stealth control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - critical stealth background
                 * - critical readable foreground (a11y)
                 * - critical safety border
                 */
                fillStealthControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.critical.fill.stealth,
                            foregroundFill: onFill(color.critical.stroke.readable),
                            ...densityBorder(color.critical.stroke.safety),
                        },
                    },
                    { formerNames: ["color.critical-fill-stealth-control"] }
                ),
                /**
                 * Convenience treatment for an critical-filled subtle control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - critical subtle background
                 * - critical readable foreground (a11y)
                 * - critical safety border
                 */
                fillSubtleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.critical.fill.subtle,
                            foregroundFill: onFill(color.critical.stroke.readable),
                            ...densityBorder(color.critical.stroke.safety),
                        },
                    },
                    { formerNames: ["color.critical-fill-subtle-control"] }
                ),
                /**
                 * Convenience treatment for an critical-filled subtle inverse control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - critical subtle inverse background
                 * - critical readable foreground (a11y)
                 * - critical safety border
                 */
                fillSubtleInverseControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.critical.fill.subtleInverse,
                            foregroundFill: onFill(color.critical.stroke.readable),
                            ...densityBorder(color.critical.stroke.safety),
                        },
                    },
                    { formerNames: ["color.critical-fill-subtle-inverse-control"] }
                ),
                /**
                 * Convenience treatment for an critical-filled ideal control (interactive).
                 *
                 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
                 * - critical ideal background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillIdealControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.critical.fill.ideal,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.critical-fill-ideal-control"] }
                ),
                /**
                 * Convenience treatment for an critical-filled discernible control (interactive).
                 *
                 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
                 * - critical discernible background (a11y)
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillDiscernibleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.critical.fill.discernible,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.discernible),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.critical-fill-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an critical-filled readable control (interactive).
                 *
                 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
                 * - critical readable background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillReadableControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.critical.fill.readable,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.critical-fill-readable-control"] }
                ),
                /**
                 * Convenience treatment for an critical-outlined discernible control (interactive).
                 *
                 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
                 * - fill color background
                 * - critical readable foreground
                 * - critical discernible border
                 */
                outlineDiscernibleControl: treatment(
                    {
                        properties: {
                            ...densityBorder(color.critical.stroke.discernible),
                            foregroundFill: color.critical.stroke.readable,
                            backgroundFill: color.context,
                        },
                    },
                    { formerNames: ["color.critical-outline-discernible-control"] }
                ),
                /**
                 * Convenience treatment for an critical-colored text or icon control (interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for a link, or similar:
                 * - no background
                 * - critical readable foreground (a11y)
                 * - no border
                 */
                foregroundReadableControl: treatment(
                    {
                        properties: {
                            foregroundFill: color.critical.stroke.readable,
                        },
                    },
                    { formerNames: ["color.critical-foreground-readable-control"] }
                ),
            },
        },
        layer: {
            treatments: {
                /**
                 * Convenience treatment for a layer-filled control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - layer interactive background
                 * - neutral strong foreground (a11y)
                 * - transparent border
                 */
                fillInteractiveControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.layer.fill.interactive,
                            foregroundFill: onFill(color.neutral.stroke.strong),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.layer-fill-interactive-control"] }
                ),
            },
        },
        neutral: {
            treatments: {
                /**
                 * Convenience treatment for a neutral-filled stealth control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - neutral stealth background
                 * - neutral strong foreground (a11y)
                 * - neutral safety border
                 */
                fillStealthControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.neutral.fill.stealth,
                            foregroundFill: onFill(color.neutral.stroke.strong),
                            ...densityBorder(color.neutral.stroke.safety),
                        },
                    },
                    { formerNames: ["color.neutral-fill-stealth-control"] }
                ),
                /**
                 * Convenience treatment for a neutral-filled subtle control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - neutral subtle background
                 * - neutral strong foreground (a11y)
                 * - neutral safety border
                 */
                fillSubtleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.neutral.fill.subtle,
                            foregroundFill: onFill(color.neutral.stroke.strong),
                            ...densityBorder(color.neutral.stroke.safety),
                        },
                    },
                    { formerNames: ["color.neutral-fill-subtle-control"] }
                ),
                /**
                 * Convenience treatment for a neutral-filled subtle inverse control (interactive).
                 *
                 * By default, only the foreground color meets accessibility, useful for a button or similar:
                 * - neutral subtle inverse background
                 * - neutral strong foreground (a11y)
                 * - neutral safety border
                 */
                fillSubtleInverseControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.neutral.fill.subtleInverse,
                            foregroundFill: onFill(color.neutral.stroke.strong),
                            ...densityBorder(color.neutral.stroke.safety),
                        },
                    },
                    { formerNames: ["color.neutral-fill-subtle-inverse-control"] }
                ),
                /**
                 * Convenience treatment for an neutral-filled ideal control (interactive).
                 *
                 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
                 * - neutral ideal background
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillIdealControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.neutral.fill.ideal,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.readable),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.neutral-fill-ideal-control"] }
                ),
                /**
                 * Convenience treatment for a neutral-filled discernible control (interactive).
                 *
                 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
                 * - neutral discernible background (a11y)
                 * - black or white foreground (a11y)
                 * - no border
                 */
                fillDiscernibleControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.neutral.fill.discernible,
                            foregroundFill: blackOrWhiteOnFill(color.blackOrWhite.discernible),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.neutral-fill-discernible-control"] }
                ),
                /**
                 * Convenience treatment for a neutral-filled readable control (interactive).
                 *
                 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
                 * - neutral readable background
                 * - neutral strong foreground (a11y)
                 * - no border
                 */
                fillReadableControl: treatment(
                    {
                        properties: {
                            backgroundFill: color.neutral.fill.readable,
                            foregroundFill: onFill(color.neutral.stroke.strong),
                            ...densityBorder(transparent),
                        },
                    },
                    { formerNames: ["color.neutral-fill-readable-control"] }
                ),
                /**
                 * Convenience treatment for a neutral-outlined discernible control (interactive).
                 *
                 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
                 * - fill color background
                 * - neutral strong foreground
                 * - neutral discernible border
                 */
                outlineDiscernibleControl: treatment(
                    {
                        properties: {
                            ...densityBorder(color.neutral.stroke.discernible),
                            foregroundFill: { rest: color.neutral.stroke.strong, disabled: color.neutral.stroke.strong },
                            backgroundFill: color.context,
                        },
                    },
                    { formerNames: ["color.neutral-outline-discernible-control"] }
                ),
                /**
                 * Convenience treatment for neutral-colored hint or placeholder text or icons (not interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for hint, placeholder, or secondary text:
                 * - no background
                 * - neutral readable foreground (a11y)
                 * - no border
                 */
                foregroundReadableElement: treatment(
                    {
                        properties: {
                            foregroundFill: { rest: color.neutral.stroke.readable, disabled: color.neutral.stroke.readable },
                        },
                    },
                    { formerNames: ["color.neutral-foreground-readable-element"] }
                ),
                /**
                 * Convenience treatment for neutral-colored regular text or icons (not interactive).
                 *
                 * By default, the foreground color meets accessibility, useful for regular text:
                 * - no background
                 * - neutral strong foreground (a11y)
                 * - no border
                 */
                foregroundStrongElement: treatment(
                    {
                        properties: {
                            foregroundFill: { rest: color.neutral.stroke.strong, disabled: color.neutral.stroke.strong },
                        },
                    },
                    { formerNames: ["color.neutral-foreground-strong-element"] }
                ),
                /**
                 * Convenience treatment for neutral-colored divider for presentation role.
                 *
                 * By default, the foreground color does not meet accessibility, useful for presentation only:
                 * - no background
                 * - neutral subtle foreground
                 * - no border
                 */
                dividerSubtleElement: treatment(
                    {
                        properties: {
                            foregroundFill: { rest: color.neutral.stroke.subtle, disabled: color.neutral.stroke.strong },
                        },
                    },
                    { formerNames: ["color.neutral-divider-subtle-element"] }
                ),
                /**
                 * Convenience treatment for neutral-colored divider for separator role.
                 *
                 * By default, the foreground color meets accessibility, useful for semantic separation:
                 * - no background
                 * - neutral discernible foreground (a11y)
                 * - no border
                 */
                dividerDiscernibleElement: treatment(
                    {
                        properties: {
                            foregroundFill: { rest: color.neutral.stroke.discernible, disabled: color.neutral.stroke.strong },
                        },
                    },
                    { formerNames: ["color.neutral-divider-discernible-element"] }
                ),
            },
        },
    },
    typography: {
        ramp: {
            default: {
                treatments: {
                    /**
                     * Convenience treatment combining all font values for the `base` type ramp.
                     */
                    base: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.base,
                                lineHeight: typography.ramp.default.lineHeight.base,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.base,
                            },
                        },
                        { formerNames: ["text.type-ramp-base"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `minus 1` type ramp.
                     */
                    minus1: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.minus1,
                                lineHeight: typography.ramp.default.lineHeight.minus1,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.minus1,
                            },
                        },
                        { formerNames: ["text.type-ramp-minus-1"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `minus 2` type ramp.
                     */
                    minus2: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.minus2,
                                lineHeight: typography.ramp.default.lineHeight.minus2,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.minus2,
                            },
                        },
                        { formerNames: ["text.type-ramp-minus-2"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `plus 1` type ramp.
                     */
                    plus1: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.plus1,
                                lineHeight: typography.ramp.default.lineHeight.plus1,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.plus1,
                            },
                        },
                        { formerNames: ["text.type-ramp-plus-1"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `plus 2` type ramp.
                     */
                    plus2: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.plus2,
                                lineHeight: typography.ramp.default.lineHeight.plus2,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.plus2,
                            },
                        },
                        { formerNames: ["text.type-ramp-plus-2"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `plus 3` type ramp.
                     */
                    plus3: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.plus3,
                                lineHeight: typography.ramp.default.lineHeight.plus3,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.plus3,
                            },
                        },
                        { formerNames: ["text.type-ramp-plus-3"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `plus 4` type ramp.
                     */
                    plus4: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.plus4,
                                lineHeight: typography.ramp.default.lineHeight.plus4,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.plus4,
                            },
                        },
                        { formerNames: ["text.type-ramp-plus-4"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `plus 5` type ramp.
                     */
                    plus5: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.plus5,
                                lineHeight: typography.ramp.default.lineHeight.plus5,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.plus5,
                            },
                        },
                        { formerNames: ["text.type-ramp-plus-5"] }
                    ),
                    /**
                     * Convenience treatment combining all font values for the `plus 6` type ramp.
                     */
                    plus6: treatment(
                        {
                            properties: {
                                fontFamily: typography.fontFamily.default,
                                fontSize: typography.ramp.default.fontSize.plus6,
                                lineHeight: typography.ramp.default.lineHeight.plus6,
                                fontWeight: typography.fontWeight.default,
                                fontVariationSettings: typography.ramp.default.fontVariations.plus6,
                            },
                        },
                        { formerNames: ["text.type-ramp-plus-6"] }
                    ),
                },
            },
        },
    },
    elevation: {
        card: {
            treatment: {
                $root: treatment(
                    {
                        properties: {
                            shadow: { rest: elevation.card.$root },
                        },
                    },
                    { formerNames: ["shadow.card"] }
                ),
                interactive: treatment(
                    {
                        properties: {
                            shadow: elevation.card.$root,
                        },
                    },
                    { formerNames: ["shadow.card-interactive"] }
                ),
            },
        },
        tooltip: {
            treatment: treatment(
                {
                    properties: {
                        shadow: elevation.tooltip.$root,
                    },
                },
                { formerNames: ["shadow.tooltip"] }
            ),
        },
        flyout: {
            treatment: treatment(
                {
                    properties: {
                        shadow: elevation.flyout.$root,
                    },
                },
                { formerNames: ["shadow.flyout"] }
            ),
        },
        dialog: {
            treatment: treatment(
                {
                    properties: {
                        shadow: elevation.dialog.$root,
                    },
                },
                { formerNames: ["shadow.dialog"] }
            ),
        },
    },
    treatments: {
        actionControl: treatment(
            {
                treatments: [tokens.shape.treatments.control, tokens.density.control.treatment, tokens.typography.ramp.default.treatments.base, tokens.color.neutral.treatments.fillSubtleControl],
                properties: {
                    ...densityBorder(color.neutral.stroke.subtle),
                },
            },
            { formerNames: ["styles.action-control"] }
        ),
        inputBase: treatment(
            {
                treatments: [tokens.shape.treatments.control, tokens.typography.ramp.default.treatments.base, tokens.color.neutral.treatments.fillSubtleInverseControl],
                properties: {
                    ...densityBorder(color.neutral.stroke.discernible),
                },
            },
            { formerNames: ["styles.input-base"] }
        ),
        inputControl: treatment(
            {
                treatments: [tokens.treatments.inputBase, tokens.density.control.treatment],
            },
            { formerNames: ["styles.input-control"] }
        ),
        inputAutofillControl: treatment(
            {
                treatments: [tokens.treatments.inputBase, tokens.density.control.treatment.autofillOuter],
            },
            { formerNames: ["styles.input-autofill-control"] }
        ),
        selectableControlSelected: treatment(
            {
                treatments: [tokens.shape.treatments.control, tokens.typography.ramp.default.treatments.base, tokens.color.highlight.treatments.fillReadableControl],
            },
            { formerNames: ["styles.selectable-control-selected"] }
        ),
        selectableControlUnselected: treatment(
            {
                treatments: [tokens.shape.treatments.control, tokens.typography.ramp.default.treatments.base, tokens.color.neutral.treatments.outlineDiscernibleControl],
            },
            { formerNames: ["styles.selectable-control-unselected"] }
        ),
        itemControl: treatment(
            {
                treatments: [tokens.shape.treatments.control, tokens.density.control.treatment, tokens.typography.ramp.default.treatments.base, tokens.color.neutral.treatments.fillStealthControl],
            },
            { formerNames: ["styles.item-control"] }
        ),
        textPlain: treatment(
            {
                treatments: [tokens.typography.ramp.default.treatments.base, tokens.color.neutral.treatments.foregroundStrongElement],
            },
            { formerNames: ["styles.text-plain"] }
        ),
        textPlainMultiline: treatment(
            {
                treatments: [tokens.typography.ramp.default.treatments.base, tokens.color.neutral.treatments.foregroundStrongElement],
                properties: {
                    lineHeight: typography.ramp.default.lineHeightMultiline.base,
                },
            },
            { formerNames: ["styles.text-plain-multiline"] }
        ),
        textLabel: treatment(
            {
                treatments: [tokens.typography.ramp.default.treatments.base, tokens.color.neutral.treatments.foregroundStrongElement],
                properties: {
                    fontFamily: typography.fontFamily.label,
                    fontStyle: typography.fontStyle.label,
                    fontWeight: typography.fontWeight.label,
                },
            },
            { formerNames: ["styles.text-label"] }
        ),
        flyout: treatment(
            {
                treatments: [tokens.shape.treatments.layer, tokens.elevation.flyout.treatment],
                properties: {
                    backgroundFill: color.layer.fill.ramp.plus1,
                },
            },
            { formerNames: ["styles.flyout"] }
        ),
        /**
         * Treatment for the disabled state.
         *
         * By default, sets the cursor to "not-allowed".
         */
        disabled: treatment(
            {
                properties: {
                    cursor: "not-allowed",
                },
            },
            { formerNames: ["styles.disabled"] }
        ),
        /**
         * Treatment for the interactive cursor.
         *
         * By default, sets the cursor to "pointer".
         */
        interactiveCursor: treatment(
            {
                properties: {
                    cursor: "pointer",
                },
            },
            { formerNames: ["styles.interactiveCursor"] }
        ),
        focusIndicator: treatment(
            {
                properties: {
                    outlineColor: color.focusStroke.$root,
                    outlineOffset: "1px",
                    outlineStyle: "solid",
                    outlineThickness: shape.strokeThickness.focus,
                },
            },
            { formerNames: ["styles.focus-indicator"] }
        ),
        focusReset: treatment(
            {
                properties: {
                    outlineStyle: "none",
                },
            },
            { formerNames: ["styles.focus-reset"] }
        ),
    },
};

/**
 * The treatments that the anatomy of a component applies, for the states that every component has the same way.
 *
 * @beta
 */
export const referenceAnatomyTreatments: AnatomyTreatments = {
    disabled: tokens.treatments.disabled,
    focusIndicator: tokens.treatments.focusIndicator,
    focusReset: tokens.treatments.focusReset,
};
