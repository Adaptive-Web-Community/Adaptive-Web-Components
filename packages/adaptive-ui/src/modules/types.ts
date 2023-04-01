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
 * Parameters used to apply style modules to components.
 *
 * @public
 */
export interface StyleModuleTarget {
    /**
     * The condition to match at the host element level.
     */
    hostCondition?: string;

    /**
     * The component part name to apply this style module.
     */
    part?: string;

    /**
     * The condition to match at the part element level.
     */
    partCondition?: string;
}

/**
 * Parameters provided by a component to inform style modules of its interactivity configuration.
 *
 * @public
 */
export interface InteractivityDefinition {
    /**
     * The selector indicating the component or element is interactive, like `:not([disabled])`.
     */
    interactivitySelector?: string;

    /**
     * The selector indicating the component or element is not interactive, like `[disabled]`.
     */
    nonInteractivitySelector?: string;
}

/**
 * Parameters used to evaluate style modules for a component.
 *
 * @public
 */
export type StyleModuleEvaluateParameters = StyleModuleTarget & InteractivityDefinition;

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
