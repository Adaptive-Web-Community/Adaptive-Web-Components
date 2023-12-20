import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { StyleProperty } from "../modules/types.js";
import { DesignTokenMultiValue, DesignTokenType } from "../adaptive-design-tokens.js";
import { createTokenNonCss, createTokenRecipe } from "../token-helpers.js";
import { createTokenShadow, Shadow, ShadowValue } from "../shadow/index.js";
import { _black } from "../color/utilities/color-constants.js";
import { InteractiveTokenGroup } from "../types.js";

/**
 * @public
 */
export const elevationRecipe = createTokenRecipe<number, ShadowValue>("elevation-recipe", StyleProperty.shadow,
    (resolve: DesignTokenResolver, size: number): ShadowValue => {
        let ambientOpacity = 0.12;
        let directionalOpacity = 0.14;

        if (size > 16) {
            ambientOpacity = 0.2;
            directionalOpacity = 0.24;
        }

        const ambient = new Shadow(_black.toTransparent(ambientOpacity), 0, 0, 2);
        const directional = new Shadow(_black.toTransparent(directionalOpacity), 0, size * 0.5, size);
        return new DesignTokenMultiValue(ambient, directional);
    },
);

/** @public */
export const elevationCardRestSize = createTokenNonCss<number>("elevation-card-rest-size", DesignTokenType.number).withDefault(4);

/** @public */
export const elevationCardHoverSize = createTokenNonCss<number>("elevation-card-hover-size", DesignTokenType.number).withDefault(8);

/** @public */
export const elevationCardActiveSize = createTokenNonCss<number>("elevation-card-active-size", DesignTokenType.number).withDefault(2);

/** @public */
export const elevationCardFocusSize = createTokenNonCss<number>("elevation-card-focus-size", DesignTokenType.number).withDefault(4);

/** @public */
export const elevationCardDisabledSize = createTokenNonCss<number>("elevation-card-disabled-size", DesignTokenType.number).withDefault(0);

/** @public */
export const elevationCardRest = createTokenShadow("elevation-card-rest").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardRestSize))
);

/** @public */
export const elevationCardHover = createTokenShadow("elevation-card-hover").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardHoverSize))
);

/** @public */
export const elevationCardActive = createTokenShadow("elevation-card-active").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardActiveSize))
);

/** @public */
export const elevationCardFocus = createTokenShadow("elevation-card-focus").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardFocusSize))
);

/** @public */
export const elevationCardDisabled = createTokenShadow("elevation-card-disabled").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationCardDisabledSize))
);

/** @public */
export const elevationCardInteractive: InteractiveTokenGroup<ShadowValue> = {
    name: "elevation-card",
    type: DesignTokenType.shadow,
    intendedFor: StyleProperty.shadow,
    rest: elevationCardRest,
    hover: elevationCardHover,
    active: elevationCardActive,
    focus: elevationCardFocus,
    disabled: elevationCardDisabled,
};

/** @public */
export const elevationTooltipSize = createTokenNonCss<number>("elevation-tooltip-size", DesignTokenType.number).withDefault(16);

/** @public */
export const elevationTooltip = createTokenShadow("elevation-tooltip").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationTooltipSize))
);

/** @public */
export const elevationFlyoutSize = createTokenNonCss<number>("elevation-flyout-size", DesignTokenType.number).withDefault(32);

/** @public */
export const elevationFlyout = createTokenShadow("elevation-flyout").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationFlyoutSize))
);

/** @public */
export const elevationDialogSize = createTokenNonCss<number>("elevation-dialog-size", DesignTokenType.number).withDefault(128);

/** @public */
export const elevationDialog = createTokenShadow("elevation-dialog").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(elevationRecipe).evaluate(resolve, resolve(elevationDialogSize))
);
