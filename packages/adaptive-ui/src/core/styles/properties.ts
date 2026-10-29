import type { ValuesOf } from "@microsoft/fast-foundation";
import type { DesignToken, Library } from "design-token-library";
import type { Paint } from "../color/paint.js";
import type { InteractiveSet } from "../interactive.js";

/**
 * Supported style properties for design-to-code with Adaptive UI.
 *
 * Generalizes CSS properties which are also commonly supported in design tools (Figma) so the recipes can
 * be applied in tooling or in the browser.
 *
 * @public
 */
export const StyleProperty = {
    backgroundFill: "backgroundFill",
    foregroundFill: "foregroundFill",
    borderFillTop: "borderFillTop",
    borderFillRight: "borderFillRight",
    borderFillBottom: "borderFillBottom",
    borderFillLeft: "borderFillLeft",
    borderThicknessTop: "borderThicknessTop",
    borderThicknessRight: "borderThicknessRight",
    borderThicknessBottom: "borderThicknessBottom",
    borderThicknessLeft: "borderThicknessLeft",
    borderStyleTop: "borderStyleTop",
    borderStyleRight: "borderStyleRight",
    borderStyleBottom: "borderStyleBottom",
    borderStyleLeft: "borderStyleLeft",
    cornerRadiusTopLeft: "cornerRadiusTopLeft",
    cornerRadiusTopRight: "cornerRadiusTopRight",
    cornerRadiusBottomRight: "cornerRadiusBottomRight",
    cornerRadiusBottomLeft: "cornerRadiusBottomLeft",
    fontFamily: "fontFamily",
    fontSize: "fontSize",
    fontWeight: "fontWeight",
    fontStyle: "fontStyle",
    fontVariationSettings: "fontVariationSettings",
    letterSpacing: "letterSpacing",
    lineHeight: "lineHeight",
    marginTop: "marginTop",
    marginRight: "marginRight",
    marginBottom: "marginBottom",
    marginLeft: "marginLeft",
    paddingTop: "paddingTop",
    paddingRight: "paddingRight",
    paddingBottom: "paddingBottom",
    paddingLeft: "paddingLeft",
    gap: "gap",
    height: "height",
    minHeight: "minHeight",
    maxHeight: "maxHeight",
    width: "width",
    minWidth: "minWidth",
    maxWidth: "maxWidth",
    // layoutOuter: "layoutOuter", // TODO Add support for inline or block definition
    layoutInner: "layoutInner",
    layoutDirection: "layoutDirection",
    layoutMainAxisAlignItems: "layoutMainAxisAlignItems",
    layoutCrossAxisAlignItems: "layoutCrossAxisAlignItems",
    layoutWrap: "layoutWrap",
    opacity: "opacity",
    cursor: "cursor",
    outlineColor: "outlineColor",
    outlineOffset: "outlineOffset",
    outlineStyle: "outlineStyle",
    outlineThickness: "outlineThickness",
    shadow: "shadow",
} as const;

/**
 * Supported style properties for design-to-code with Adaptive UI.
 *
 * Generalizes CSS properties which are also commonly supported in design tools (Figma) so the recipes can
 * be applied in tooling or in the browser.
 *
 * @public
 */
export type StyleProperty = ValuesOf<typeof StyleProperty>;

/**
 * @public
 */
export const StylePropertyShorthand = {
    borderFill: [
        StyleProperty.borderFillTop,
        StyleProperty.borderFillRight,
        StyleProperty.borderFillBottom,
        StyleProperty.borderFillLeft,
    ],
    borderThickness: [
        StyleProperty.borderThicknessTop,
        StyleProperty.borderThicknessRight,
        StyleProperty.borderThicknessBottom,
        StyleProperty.borderThicknessLeft,
    ],
    borderStyle: [
        StyleProperty.borderStyleTop,
        StyleProperty.borderStyleRight,
        StyleProperty.borderStyleBottom,
        StyleProperty.borderStyleLeft,
    ],
    cornerRadius: [
        StyleProperty.cornerRadiusTopLeft,
        StyleProperty.cornerRadiusTopRight,
        StyleProperty.cornerRadiusBottomRight,
        StyleProperty.cornerRadiusBottomLeft,
    ],
    margin: [
        StyleProperty.marginTop,
        StyleProperty.marginRight,
        StyleProperty.marginBottom,
        StyleProperty.marginLeft,
    ],
    marginHorizontal: [
        StyleProperty.marginRight,
        StyleProperty.marginLeft,
    ],
    marginVertical: [
        StyleProperty.marginTop,
        StyleProperty.marginBottom,
    ],
    padding: [
        StyleProperty.paddingTop,
        StyleProperty.paddingRight,
        StyleProperty.paddingBottom,
        StyleProperty.paddingLeft,
    ],
    paddingHorizontal: [
        StyleProperty.paddingRight,
        StyleProperty.paddingLeft,
    ],
    paddingVertical: [
        StyleProperty.paddingTop,
        StyleProperty.paddingBottom,
    ],
};

/**
 * Supported style property shorthands for design-to-code with Adaptive UI.
 *
 * @public
 */
export type StylePropertyShorthand = keyof typeof StylePropertyShorthand;

/**
 * Key for a style property, a {@link (StyleProperty:type)}, {@link (StylePropertyShorthand:type)}, or a string for any other CSS property.
 *
 * @public
 */
export type StyleKey = StyleProperty | StylePropertyShorthand | (string & Record<never, never>);

/**
 * A value of a style property: a value of CSS, a value of a token type, or a ref to a token of a library, which is written as the `var()` of
 * its custom property.
 *
 * @public
 */
export type StyleValue =
    | string
    | number
    | Paint
    | DesignToken.Values.Readonly.Shadow
    | DesignToken.Values.Readonly.Dimension
    | Library.Ref<unknown, never>;

/**
 * A value of a style property, or a value for each state of an interactive element.
 *
 * @remarks
 * A ref to an interactive token is written as a value for each state that the token has. In a set, the value of a state that is a ref to an
 * interactive token is the value of the token in that state, so `{ rest: a, disabled: b }` is the rest of `a` and the disabled of `b`.
 *
 * @public
 */
export type StyleValues = StyleValue | InteractiveSet<StyleValue>;

/**
 * The style properties of a treatment or a rule, where the key is the {@link (StyleKey:type)} and the value is a value or a ref to a token.
 *
 * @public
 */
export type StyleProperties = Partial<Record<StyleKey, StyleValues>>;
