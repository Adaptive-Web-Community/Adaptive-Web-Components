import type { ValuesOf } from "@microsoft/fast-foundation";
import { Styles } from "./styles.js";

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
 * Type of the `conditions` for component {@link ComponentAnatomy}.
 *
 * @public
 */
export type ComponentConditions = Record<string, string>;

/**
 * Type of the `parts` for component {@link ComponentAnatomy}.
 *
 * @public
 */
export type ComponentParts = Record<string, string>;

/**
 * Structure describing component anatomy for modular styling.
 *
 * @public
 */
export interface ComponentAnatomy<TConditions extends ComponentConditions, TParts extends ComponentParts> {
    interactivity?: InteractivityDefinition;
    conditions: TConditions;
    parts: TParts;
}

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
 * Common patterns for {@link InteractivityDefinition}.
 *
 * @public
 */
export const Interactivity = {
    disabledAttribute: { 
        interactivitySelector: ":not([disabled])",
        nonInteractivitySelector: "[disabled]",
    } as InteractivityDefinition,
    hrefAttribute:  { 
        interactivitySelector: "[href]",
        nonInteractivitySelector: ":not([href])",
    } as InteractivityDefinition,
    always: { 
        interactivitySelector: "",
        nonInteractivitySelector: "",
    } as InteractivityDefinition,
    never: { 
        interactivitySelector: undefined,
        nonInteractivitySelector: undefined,
    } as InteractivityDefinition,
} as const;

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
    fontVariationSettings: "fontVariationSettings",
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
 * @public
 */
export type StyleModules = Iterable<readonly [StyleModuleTarget, Styles]>;
