import type { ValuesOf } from "@microsoft/fast-foundation";
import { StyleRule } from "./styles.js";

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
export type StateSelector = "hover" | "active" | FocusSelector | "disabled";

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
    /**
     * The context element selector. Implementation defaults to `:host` if not provided.
     */
    context?: string;

    /**
     * Description of the conditions for when the component is interactive or not.
     */
    interactivity?: InteractivityDefinition;

    /**
     * List of conditions a component supports, like being selected or changing orientation.
     */
    conditions: TConditions;

    /**
     * List of parts exposed by the component.
     */
    parts: TParts;

    /**
     * Description of the focus structure of the component.
     */
    focus?: FocusDefinition<TParts>;
}

/**
 * Parameters used to apply style modules to components.
 *
 * @public
 */
export interface StyleModuleTarget {
    /**
     * The selector for the context element. Implementation defaults to `:host` if not provided.
     */
    context?: string;

    /**
     * The condition to match on the context element.
     */
    contextCondition?: string;

    /**
     * Normally the state applies to the context element, or if specified, the part. This option forces the state to the
     * apply to the context element, useful for styling the context element state in only a portion of the child elements.
     */
    stateOnContext?: boolean;

    /**
     * The component part name to apply this style module.
     */
    part?: string;

    /**
     * The condition to match on the part element.
     */
    partCondition?: string;

    /**
     * Informs the style generator to ignore the interactivity configuration of the component.
     *
     * @beta
     * @remarks
     * The `StyleModuleTarget` and `InteractivityDefinition` together makeup the evaluation parameters for
     * generating the styles. In some edge case scenarios the default behavior of considering both of these
     * together is not desireable (ex: Menu items which should show focus when disabled). This is an
     * exploration into a way to describe this, but perhaps there's a more extensible pattern.
     */
    ignoreInteractivity?: boolean;

    /**
     * The state selector for focus indication.
     */
    focusSelector?: FocusSelector;
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
     * The selector indicating the component or element is disabled, like `[disabled]`.
     */
    disabledSelector?: string;
}

/**
 * Common patterns for {@link InteractivityDefinition}.
 *
 * @public
 */
export const Interactivity = {
    /**
     * Has interactive or disabled states based on the `disabled` attribute.
     *
     * For instance, a form control.
     */
    disabledAttribute: { 
        interactivitySelector: ":not([disabled])",
        disabledSelector: "[disabled]",
    } as InteractivityDefinition,

    /**
     * Has interactive states based on the `href` attribute, but never a disabled state.
     *
     * For instance, an `<a>` should style as plain text when it doesn't have an `href` attribute.
     */
    hrefAttribute:  { 
        interactivitySelector: "[href]",
        disabledSelector: undefined,
    } as InteractivityDefinition,

    /**
     * Is always interactive and never has a disabled state.
     *
     * For instance, cards or list items that are not able to be disabled.
     */
    always: { 
        interactivitySelector: "",
        disabledSelector: undefined,
    } as InteractivityDefinition,

    /**
     * Is never interactive or disabled, that is, a plain static element.
     *
     * For instance, body text, headings, illustrations, etc.
     */
    never: { 
        interactivitySelector: undefined,
        disabledSelector: undefined,
    } as InteractivityDefinition,
} as const;

/**
 * Defines the focus indicator structure for the component, including which part will naturally receive focus
 * and which part should indicate it.
 *
 * @public
 */
export interface FocusDefinition<TParts> {
    /**
     * The focus indication element.
     */
    focusTarget: StyleModuleTarget,

    /**
     * The focusable element to reset browser default styles, for instance, a native input element or an element with a `tabindex`.
     */
    resetTarget: StyleModuleTarget,
}

/**
 * Common patterns for {@link FocusDefinition}.
 *
 * @public
 */
export const Focus = {
    /**
     * The simple case of the context element accepting and indicating focus.
     */
    contextFocused: () => {
        return {
            focusTarget: {
                ignoreInteractivity: true,
            },
        } as FocusDefinition<any>;
    },

    /**
     * The context element has focus, but a child element is the indicator.
     *
     * @param indicatorPart - The part name of where to indicate focus.
     */
    contextChildFocused: <TParts>(indicatorPart: keyof TParts & string) => {
        return {
            focusTarget: {
                stateOnContext: true,
                part: indicatorPart,
                ignoreInteractivity: true,
            },
            resetTarget: {
                ignoreInteractivity: true,
            }
        } as FocusDefinition<TParts>;
    },

    /**
     * A child element is focusable and will indicate focus itself.
     *
     * @param part - The part name of the focusable part.
     */
    partFocused: <TParts>(part: keyof TParts & string) => {
        return {
            focusTarget: {
                part,
                ignoreInteractivity: true,
            },
        } as FocusDefinition<TParts>;
    },

    /**
     * A child element is focusable, but an ancestor will display the indicator.
     *
     * @param indicatorPart - The part name of the wrapper of the focusable element.
     * @param focusablePart - The element that accepts focus.
     */
    partWithin: <TParts>(indicatorPart: keyof TParts & string, focusablePart: keyof TParts & string) => {
        return {
            focusTarget: {
                part: indicatorPart,
                focusSelector: "focus-within",
                ignoreInteractivity: true,
            },
            resetTarget: {
                part: focusablePart,
                ignoreInteractivity: true,
            }
        } as FocusDefinition<TParts>;
    },
} as const;

/**
 * Parameters used to evaluate style modules for a component.
 *
 * @public
 */
export type StyleModuleEvaluateParameters = StyleModuleTarget & InteractivityDefinition;

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
    paddingTop: "paddingTop",
    paddingRight: "paddingRight",
    paddingBottom: "paddingBottom",
    paddingLeft: "paddingLeft",
    gap: "gap",
    height: "height",
    width: "width",
    layoutDirection: "layoutDirection",
    opacity: "opacity",
    cursor: "cursor",
    outlineColor: "outlineColor",
    outlineOffset: "outlineOffset",
    outlineStyle: "outlineStyle",
    outlineWidth: "outlineWidth",
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
 * Any style property, either an {@link (StyleProperty:type)} or a string for any other CSS property.
 *
 * @public
 */
export type StylePropertyCss = StyleProperty | (string & Record<never, never>);

/**
 * A convenience shorthand for all border fill {@link (StyleProperty:type)} values.
 *
 * @public
 */
export const stylePropertyBorderFillAll = [
    StyleProperty.borderFillTop,
    StyleProperty.borderFillRight,
    StyleProperty.borderFillBottom,
    StyleProperty.borderFillLeft
];

/**
 * A convenience shorthand for all border thickness {@link (StyleProperty:type)} values.
 *
 * @public
 */
export const stylePropertyBorderThicknessAll = [
    StyleProperty.borderThicknessTop,
    StyleProperty.borderThicknessRight,
    StyleProperty.borderThicknessBottom,
    StyleProperty.borderThicknessLeft
];

/**
 * A convenience shorthand for all border style {@link (StyleProperty:type)} values.
 *
 * @public
 */
export const stylePropertyBorderStyleAll = [
    StyleProperty.borderStyleTop,
    StyleProperty.borderStyleRight,
    StyleProperty.borderStyleBottom,
    StyleProperty.borderStyleLeft
];

/**
 * A convenience shorthand for all corner radius {@link (StyleProperty:type)} values.
 *
 * @public
 */
export const stylePropertyCornerRadiusAll = [
    StyleProperty.cornerRadiusTopLeft,
    StyleProperty.cornerRadiusTopRight,
    StyleProperty.cornerRadiusBottomRight,
    StyleProperty.cornerRadiusBottomLeft
];

/**
 * A convenience shorthand for all padding {@link (StyleProperty:type)} values.
 *
 * @public
 */
export const stylePropertyPaddingAll = [
    StyleProperty.paddingTop,
    StyleProperty.paddingRight,
    StyleProperty.paddingBottom,
    StyleProperty.paddingLeft
];

/**
 * A list of {@link StyleRule}s in the context of a component.
 *
 * @public
 */
export type StyleRules = Iterable<StyleRule>;
