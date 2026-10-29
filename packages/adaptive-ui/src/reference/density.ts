import { DesignToken, Library, px, refs } from "design-token-library";
import { createDensity, DensitySetTokens } from "../core/density/index.js";
import { withFormerNames } from "../core/token-metadata.js";
import { kebabName } from "../core/token-names.js";
import { appearance, AppearanceTokens } from "./appearance.js";

/**
 * The tokens of the density: the adjustment, and the sets of the padding and gap of text, controls, lists of controls, and layers.
 *
 * @public
 */
export interface DensityTokens {
    /**
     * The adjustment (plus or minus) to the density units, which is added to the units and not a multiplier.
     * Ex: `-1` to reduce all the density values. May be fractional.
     */
    adjustmentUnits: DesignToken.Number;
    text: DensitySetTokens;
    control: DensitySetTokens;
    controlList: DensitySetTokens;
    layer: DensitySetTokens;
}

/**
 * The tokens of a library that has the density tokens, with the appearance tokens that they are calculated from.
 *
 * @public
 */
export interface DensityLibraryTokens extends AppearanceTokens {
    density: DensityTokens;
}

const tokens = refs<DensityLibraryTokens>();

// What the sets are measured in: the design unit, and a border that the padding is adjusted for.
const designUnit = tokens.global.designUnit;
const strokeThickness = tokens.shape.strokeThickness.default;

/**
 * The configuration of the density tokens, for the library.
 *
 * @public
 */
export const density: Library.Config<DensityTokens, DensityLibraryTokens> = withFormerNames(
    {
        adjustmentUnits: { $type: DesignToken.Type.Number, $value: 0 },
        ...createDensity("text", { horizontalPadding: 0, horizontalGap: 1, verticalPadding: 0, verticalGap: 1 }, designUnit, px(0)),
        ...createDensity("control", { horizontalPadding: 3, horizontalGap: 2, verticalPadding: 2, verticalGap: 1 }, designUnit, strokeThickness),
        ...createDensity("controlList", { horizontalPadding: 1, horizontalGap: 0, verticalPadding: 1, verticalGap: 0 }, designUnit, strokeThickness),
        ...createDensity("layer", { horizontalPadding: 4, horizontalGap: 4, verticalPadding: 4, verticalGap: 4 }, designUnit, px(0)),
    },
    // 0.x named a token of a set `density_<set>-<path>`, and the list set was `itemContainer` until 0.14.
    ([set, ...path]) => {
        if (set === "controlList") {
            return [`density.itemContainer.${path.join(".")}`, `density_item-container-${kebabName(path)}`];
        }
        return set === "control" || set === "layer" ? [`density_${set}-${kebabName(path)}`] : [];
    }
);

/**
 * Creates a library with the density tokens, and the appearance tokens that they are calculated from.
 *
 * @public
 */
export const createDensityLibrary = () => Library.create<DensityLibraryTokens>({ ...appearance, density });
