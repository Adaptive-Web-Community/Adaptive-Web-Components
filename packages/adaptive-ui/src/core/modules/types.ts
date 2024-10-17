import type { ValuesOf } from "@microsoft/fast-foundation";
import { InteractiveState } from "../types.js";
import { StyleRule } from "./styles.js";

/**
 * The selector for a true/false condition.
 *
 * @public
 */
export type BooleanCondition = string; 

/**
 * The state and selector for a multiple value condition.
 *
 * @public
 */
export type StringCondition = Record<string, string>;

/**
 * A condition associated with a component.
 *
 * @public
 */
export type Condition = BooleanCondition | StringCondition;

/**
 * Type of the `conditions` for component {@link ComponentAnatomy}.
 *
 * @public
 */
export type ComponentConditions = Record<string, Condition>;

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
     * The name of the component.
     */
    name?: string;

    /**
     * The context element selector. Implementation defaults to `:host` if not provided.
     */
    context?: string;

    /**
     * List of conditions a component supports, like being selected or changing orientation.
     */
    conditions: TConditions;

    /**
     * List of parts exposed by the component.
     */
    parts: TParts;

    /**
     * Description of the conditions for when the component is interactive or not.
     */
    interactivity?: InteractivityDefinition;

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
     * @remarks
     * The `StyleModuleTarget` and `InteractivityDefinition` together makeup the evaluation parameters for
     * generating the styles. In some edge case scenarios the default behavior of considering both of these
     * together is not desireable (ex: Menu items which should show focus when disabled). This is an
     * exploration into a way to describe this, but perhaps there's a more extensible pattern.
     *
     * @beta
     */
    ignoreInteractivity?: boolean;
}

/**
 * Conditions supported by a component to inform the style rules of its interactivity configuration.
 *
 * @public
 */
export type InteractivityDefinition = {
    /**
     * The selectors to use for the states. Implementation defaults to {@link DefaultInteractiveSelectors} if not provided.
     */
    [key in InteractiveState]?: string;
} & {
    /**
     * The selector indicating the component or element is interactive, like `:not([disabled])`.
     *
     * @remarks
     * This is combined with the `hover`, `active`, and `focus` selectors to only apply those styles
     * when the component or element is interactive.
     */
    interactive?: string;
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
        interactive: ":not([disabled])",
        disabled: "[disabled]",
    } as InteractivityDefinition,

    /**
     * Has interactive or disabled states based on a `disabled` class.
     *
     * For instance, a form control.
     */
    disabledClass: { 
        interactive: ":not(.disabled)",
        disabled: ".disabled",
    } as InteractivityDefinition,

    /**
     * Has interactive states based on the `href` attribute, but never a disabled state.
     *
     * For instance, an `<a>` should style as plain text when it doesn't have an `href` attribute.
     */
    hrefAttribute:  { 
        interactive: "[href]",
    } as InteractivityDefinition,

    /**
     * Is always interactive and never has a disabled state.
     *
     * For instance, cards or list items that are not able to be disabled.
     */
    always: { 
        interactive: "",
    } as InteractivityDefinition,

    /**
     * Is never interactive or disabled, that is, a plain static element.
     *
     * For instance, body text, headings, illustrations, etc.
     *
     * @remarks
     * This is an explicit value representing the default case.
     */
    never: { 
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
    resetTarget?: StyleModuleTarget,
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
                focus: ":focus-within",
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
 * Any style property, either an {@link (StyleProperty:type)} or a string for any other CSS property.
 *
 * @public
 * @deprecated Use StyleKey instead
 */
export type StylePropertyCss = StyleProperty | (string & Record<never, never>);

/**
 * A convenience shorthand for all border fill {@link (StyleProperty:type)} values.
 *
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const stylePropertyBorderFillAll = StylePropertyShorthand.borderFill;

/**
 * A convenience shorthand for all border thickness {@link (StyleProperty:type)} values.
 *
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const stylePropertyBorderThicknessAll = StylePropertyShorthand.borderThickness;

/**
 * A convenience shorthand for all border style {@link (StyleProperty:type)} values.
 *
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const stylePropertyBorderStyleAll = StylePropertyShorthand.borderStyle;

/**
 * A convenience shorthand for all corner radius {@link (StyleProperty:type)} values.
 *
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const stylePropertyCornerRadiusAll = StylePropertyShorthand.cornerRadius;

/**
 * A convenience shorthand for all padding {@link (StyleProperty:type)} values.
 *
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const stylePropertyPaddingAll = StylePropertyShorthand.padding;

/**
 * A list of {@link StyleRule}s in the context of a component.
 *
 * @public
 */
export type StyleRules = Array<StyleRule>;

/**
 * @beta
 */
export type SerializableBooleanCondition = string; 

/**
 * @beta
 */
export type SerializableStringCondition = Record<string, string>;

/**
 * @beta
 */
export type SerializableCondition = SerializableBooleanCondition | SerializableStringCondition;

/**
 * @beta
 */
export interface SerializableStyleRule {
    contextCondition?: Record<string, string | boolean>;
    part?: string,
    styles?: string[],
    properties?: Record<string, string>,
}

/**
 * @beta
 */
export interface SerializableAnatomy{
    name: string,
    context: string,
    conditions: Record<string, SerializableCondition>,
    parts: Record<string, string>,
    interactivity?: InteractivityDefinition,
    focus?: FocusDefinition<any>,
    styleRules: SerializableStyleRule[]
}
