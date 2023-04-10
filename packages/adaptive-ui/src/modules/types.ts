import type { CSSDirective } from "@microsoft/fast-element";
import type { CSSDesignToken, ValuesOf } from "@microsoft/fast-foundation";
import { InteractiveTokenSet } from "../types.js";

/**
 * Selectors for focus state.
 *
 * @public
 */
export type FocusSelector = "focus" | "focus-visible" | "focus-within";

/**
 * Selectors for interactive component states.
 *
 * @public
 */
export type StateSelector = "hover" | "active" | FocusSelector;

/**
 * Parameters provided when rendering style modules.
 *
 * @remarks This may be split into `host` and `part` needs.
 * @beta
 */
export interface StyleModuleEvaluateParameters {
    hostCondition?: string;
    part?: string;
    partCondition?: string;
    interactivitySelector?: string;
    nonInteractivitySelector?: string;
}

/**
 * The style property, like background color or border thickness.
 *
 * @public
 */
export const StyleProperty = {
    backgroundFill: "backgroundFill",
    foregroundFill: "foregroundFill",
    borderFill: "borderFill",
    borderThickness: "borderThickness",
    borderStyle: "borderStyle",
    cornerRadius: "cornerRadius",
    fontFamily: "fontFamily",
    fontSize: "fontSize",
    fontWeight: "fontWeight",
    fontStyle: "fontStyle",
    letterSpacing: "letterSpacing",
    lineHeight: "lineHeight",
    padding: "padding",
    gap: "gap",
    height: "height",
    width: "width",
    layoutDirection: "layoutDirection",
    opacity: "opacity",
} as const;

/**
 * The style property, like background color or border thickness.
 *
 * @public
 */
export type StyleProperty = ValuesOf<typeof StyleProperty>;

/**
 * A style definition, where the key is the {@link (StyleProperty:type)} or a custom key and the value is the token or final value.
 *
 * @public
 */
export type Styles = Partial<Record<StyleProperty, CSSDesignToken<any> | InteractiveTokenSet<any> | CSSDirective | string>>;
