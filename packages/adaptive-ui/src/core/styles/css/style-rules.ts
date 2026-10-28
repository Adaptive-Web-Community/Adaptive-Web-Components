import { isInteractiveSet } from "../../interactive.js";
import { ComponentAnatomy, Interactivity } from "../anatomy.js";
import { StyleProperties } from "../properties.js";
import { StyleRule, StyleRules, StyleRuleTarget } from "../rule.js";
import { Treatment, treatmentProperties } from "../treatment.js";
import { CssRule, renderRules, TokenPropertiesResolver } from "./rules.js";

/**
 * The treatments that the anatomy of a component applies, for the states that every component has the same way.
 *
 * @remarks
 * Expected to go with the update of the anatomy. These are a fixed list, and the renderer has code for where each applies and for its
 * state. The direction is that a treatment says its states itself (`{ focus: ... }`, `{ disabled: ... }`), the anatomy names its
 * targets (the focus target, the reset target) as an open set, and a rule targets one of them, so these become ordinary rules that a
 * system adds before those of each component.
 *
 * @beta
 */
export interface AnatomyTreatments {
    /**
     * Applied where a component that can be disabled is disabled: to the context, or to all of it when the focus is on a part, so the
     * indicator (usually the `not-allowed` cursor) doesn't show over the empty space between the parts.
     */
    readonly disabled?: Treatment;

    /**
     * Applied to the focus target in the focus state, the focus indicator.
     */
    readonly focusIndicator?: Treatment;

    /**
     * Applied to the reset target in the focus state, which takes the focus but doesn't show it.
     */
    readonly focusReset?: Treatment;
}

/**
 * What the style rules of a component are rendered with.
 *
 * @public
 */
export interface StyleRulesOptions {
    /**
     * Gets the custom properties of a token that a value refers to, see {@link libraryTokenProperties}.
     */
    readonly tokens: TokenPropertiesResolver;

    /**
     * The anatomy of the component, for the context, the interactivity, the focus, and the cursor.
     */
    readonly anatomy?: ComponentAnatomy<any, any>;

    /**
     * The treatments that the anatomy applies.
     *
     * @remarks
     * Expected to go with the update of the anatomy, see {@link AnatomyTreatments}.
     *
     * @beta
     */
    readonly treatments?: AnatomyTreatments;
}

// The properties of a treatment in the focus state only: the focus of a set, or the value itself.
function inFocus(treatment: Treatment): StyleProperties {
    const properties: StyleProperties = {};
    for (const [key, value] of treatmentProperties(treatment)) {
        const focus = isInteractiveSet(value) ? value.focus : value;
        if (focus !== undefined && focus !== null && focus !== "") {
            properties[key] = { focus };
        }
    }
    return properties;
}

// The rules that the anatomy adds: the disabled, the cursor, the focus reset, and the focus indicator.
function anatomyRules(anatomy: ComponentAnatomy<any, any>, treatments: AnatomyTreatments): StyleRule[] {
    const rules: StyleRule[] = [];
    const { interactivity, focus, cursor } = anatomy;

    if (treatments.disabled && interactivity?.disabled !== undefined) {
        // If the focus is on the context, so is the disabled state, otherwise it is on all of the component.
        const part = focus?.focusTarget.part ? "*" : undefined;
        rules.push({ target: { contextCondition: interactivity.disabled, part }, treatments: [treatments.disabled] });
    }

    if (interactivity?.interactive !== undefined && cursor !== false) {
        // An explicit cursor, or the pointer on the focus target.
        const part = typeof cursor === "object" ? cursor.part ?? focus?.focusTarget.part : focus?.focusTarget.part;
        const cursorType = (typeof cursor === "object" ? cursor.cursorType : undefined) ?? "pointer";
        if (part !== undefined || focus) {
            rules.push({ target: { contextCondition: interactivity.interactive, part }, properties: { cursor: cursorType } });
        }
    }

    if (focus) {
        if (treatments.focusReset && focus.resetTarget) {
            rules.push({ target: focus.resetTarget, properties: inFocus(treatments.focusReset) });
        }
        if (treatments.focusIndicator) {
            rules.push({ target: focus.focusTarget, properties: inFocus(treatments.focusIndicator) });
        }
    }

    return rules;
}

/**
 * Renders the style rules of a component as rules of CSS, after the rules that its anatomy adds.
 *
 * @remarks
 * The anatomy adds the treatment of the disabled state where the component can be disabled, a pointer cursor (or the cursor it says) where it is
 * interactive, and the focus reset and the focus indicator where it has focus, in that order and before the style rules. A rule without a
 * context has the context of the anatomy, and a part that is the context is the context itself.
 *
 * @param styleRules - The style rules of the component
 * @param options - The tokens, the anatomy, and the treatments the anatomy applies
 * @returns The rules of CSS
 *
 * @public
 */
export function renderStyleRules(styleRules: StyleRules, options: StyleRulesOptions): CssRule[] {
    const { tokens, anatomy, treatments = {} } = options;
    const rules = anatomy ? [...anatomyRules(anatomy, treatments), ...styleRules] : styleRules;

    return rules.flatMap(rule => {
        const target: StyleRuleTarget = { ...rule.target };
        if (anatomy?.context && target.context === undefined) {
            target.context = anatomy.context;
            if (anatomy.context === target.part) {
                target.part = undefined;
            }
        }
        const interactivity = { ...anatomy?.interactivity, ...(target.ignoreInteractivity ? Interactivity.always : {}) };
        return renderRules(treatmentProperties(rule), { ...interactivity, ...target }, tokens);
    });
}
