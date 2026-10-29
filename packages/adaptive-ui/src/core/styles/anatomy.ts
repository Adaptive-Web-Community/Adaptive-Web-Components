import { InteractiveState } from "../types.js";
import type { StyleRuleTarget } from "./rule.js";

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

    /**
     * Description of cursor behavior for interactive elements.
     * If not provided, defaults to using focus.focusTarget.part with cursor: pointer.
     * Set to false to explicitly disable automatic cursor generation.
     */
    cursor?: CursorDefinition | false;
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
    hrefAttribute: {
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
    focusTarget: StyleRuleTarget,

    /**
     * The focusable element to reset browser default styles, for instance, a native input element or an element with a `tabindex`.
     */
    resetTarget?: StyleRuleTarget,
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
 * Defines cursor behavior for interactive elements.
 *
 * @public
 */
export interface CursorDefinition {
    /**
     * The part that should receive the cursor style when interactive.
     * If undefined, uses the same part as focus.focusTarget.part.
     */
    part?: string;

    /**
     * The cursor type to apply (defaults to "pointer").
     * Common values: "pointer", "text", "move", "grab", "default".
     */
    cursorType?: string;
}

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
    stateOnContext?: boolean;
    contextCondition?: Record<string, string | boolean>;
    part?: string,
    treatments?: string[],
    properties?: Record<string, string>,
}

/**
 * @beta
 */
export interface SerializableAnatomy {
    name: string,
    context: string,
    conditions: Record<string, SerializableCondition>,
    parts: Record<string, string>,
    interactivity?: InteractivityDefinition,
    focus?: FocusDefinition<any>,
    cursor?: CursorDefinition | false,
    styleRules: SerializableStyleRule[]
}

/**
 * @beta
 */
export interface SerializableAnatomyWithImports extends SerializableAnatomy {
    imports?: string[]
}
