import { Library } from "design-token-library";
import { appearance } from "./appearance.js";
import { color, ColorTokens } from "./color.js";
import { density, DensityLibraryTokens } from "./density.js";
import { elevation, ElevationLibraryTokens } from "./elevation.js";
import {
    experimentalColor,
    ExperimentalColorTokens,
    ExperimentalLibraryTokens,
    experimentalTreatments,
    ExperimentalTreatmentTokens,
} from "./experimental.js";
import { ReferenceTreatmentTokens, treatments } from "./treatments.js";
import { typography, TypographyLibraryTokens } from "./typography.js";

/**
 * The tokens of the reference system: the appearance, the colors, the density, the shadows, and the typography, and the experimental
 * gradients with the colors.
 *
 * @public
 */
export interface ReferenceTokens extends TypographyLibraryTokens, ElevationLibraryTokens, DensityLibraryTokens, ExperimentalLibraryTokens {
    color: ColorTokens & ExperimentalColorTokens;
}

/**
 * The tokens of the reference system with its treatments, the experimental ones as well, which are in the groups of the tokens they style.
 *
 * @public
 */
export type ReferenceLibraryTokens = ReferenceTokens & ReferenceTreatmentTokens & ExperimentalTreatmentTokens;

const colors = { ...color, ...experimentalColor };

/**
 * The configuration of the tokens of the reference system, and of its treatments, for the library.
 *
 * @public
 */
export const reference: Library.Config<ReferenceLibraryTokens, ReferenceLibraryTokens> = {
    ...appearance,
    shape: { ...appearance.shape, ...treatments.shape },
    typography: {
        ...typography,
        ramp: { ...typography.ramp, default: { ...typography.ramp.default, ...treatments.typography.ramp.default } },
    },
    color: {
        ...colors,
        accent: {
            ...colors.accent,
            treatments: { ...treatments.color.accent.treatments, ...experimentalTreatments.color.accent.treatments },
        },
        highlight: { ...colors.highlight, ...treatments.color.highlight },
        info: { ...colors.info, ...treatments.color.info },
        success: { ...colors.success, ...treatments.color.success },
        warning: { ...colors.warning, ...treatments.color.warning },
        critical: { ...colors.critical, ...treatments.color.critical },
        layer: { ...colors.layer, ...treatments.color.layer },
        neutral: { ...colors.neutral, ...treatments.color.neutral },
    },
    density: {
        ...density,
        text: { ...density.text, ...treatments.density.text },
        control: { ...density.control, ...treatments.density.control },
        controlList: { ...density.controlList, ...treatments.density.controlList },
        layer: { ...density.layer, ...treatments.density.layer },
    },
    elevation: {
        ...elevation,
        card: { ...elevation.card, ...treatments.elevation.card },
        tooltip: { ...elevation.tooltip, ...treatments.elevation.tooltip },
        flyout: { ...elevation.flyout, ...treatments.elevation.flyout },
        dialog: { ...elevation.dialog, ...treatments.elevation.dialog },
    },
    treatments: treatments.treatments,
};

/**
 * Creates a library with the tokens and the treatments of the reference system.
 *
 * @public
 */
export const createReferenceLibrary = () => Library.create<ReferenceLibraryTokens>(reference);
