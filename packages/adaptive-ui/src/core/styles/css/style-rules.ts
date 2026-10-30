import { isRef } from "design-token-library";
import { isInteractiveSet } from "../../interactive.js";
import { ComponentAnatomy, Interactivity } from "../anatomy.js";
import { isOnFill, onFillsOf, OnFillWithFill } from "../on-fill.js";
import { StyleProperties, StyleValues } from "../properties.js";
import { StyleRule, StyleRules, StyleRuleTarget } from "../rule.js";
import { Treatment, treatmentProperties } from "../treatment.js";
import { TreatmentRef, TreatmentResolver } from "../treatment-token.js";
import { CssRule, renderRules, TokenPropertiesResolver } from "./rules.js";
import { SelectorParameters } from "./selector.js";

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
    readonly disabled?: TreatmentRef;

    /**
     * Applied to the focus target in the focus state, the focus indicator.
     */
    readonly focusIndicator?: TreatmentRef;

    /**
     * Applied to the reset target in the focus state, which takes the focus but doesn't show it.
     */
    readonly focusReset?: TreatmentRef;
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
     * Gets the treatment of a ref that a rule refers to, see {@link libraryTreatments}.
     */
    readonly treatments: TreatmentResolver;

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
    readonly anatomyTreatments?: AnatomyTreatments;
}

// The properties of a treatment in the focus state only: the focus of a set, or the value itself.
function inFocus(treatment: Treatment): StyleProperties {
    const properties: StyleProperties = {};
    for (const [key, value] of treatmentProperties(treatment)) {
        if (isOnFill(value)) {
            throw new Error(`The ${key} of a treatment of the focus is a value on a fill, which has no focus state of its own`);
        }
        const focus = isInteractiveSet(value) ? value.focus : value;
        if (focus !== undefined && focus !== null && focus !== "") {
            properties[key] = { focus };
        }
    }
    return properties;
}

// The rules that the anatomy adds: the disabled, the cursor, the focus reset, and the focus indicator.
function anatomyRules(anatomy: ComponentAnatomy<any, any>, treatments: AnatomyTreatments, resolve: TreatmentResolver): StyleRule[] {
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
            rules.push({ target: focus.resetTarget, properties: inFocus(resolve(treatments.focusReset)) });
        }
        if (treatments.focusIndicator) {
            rules.push({ target: focus.focusTarget, properties: inFocus(resolve(treatments.focusIndicator)) });
        }
    }

    return rules;
}

// The treatment of a rule, with the treatments it refers to, after those it gives by the deprecated name `styles`.
function treatmentOf(rule: StyleRule, resolve: TreatmentResolver): Treatment {
    const styles: readonly Treatment[] = rule.styles === undefined ? [] : isTreatmentList(rule.styles) ? rule.styles : [rule.styles];
    const treatments = (rule.treatments ?? []).map(treatment => (isWrittenInPlace(treatment) ? treatment : resolve(treatment)));
    return { treatments: [...styles, ...treatments], properties: rule.properties };
}

// A treatment written in place isn't a ref; a ref to a treatment token, and to a group that stands for its root, is.
function isWrittenInPlace(treatment: TreatmentRef | Treatment): treatment is Treatment {
    return !isRef(treatment);
}

function isTreatmentList(styles: Treatment | readonly Treatment[]): styles is readonly Treatment[] {
    return Array.isArray(styles);
}

// The properties of each rule of a component, after the rules that its anatomy adds, and its target with the context and the interactivity of
// the anatomy.
function effectiveRules(
    styleRules: StyleRules,
    options: Pick<StyleRulesOptions, "treatments" | "anatomy" | "anatomyTreatments">
): { properties: Map<string, StyleValues>; params: SelectorParameters }[] {
    const { treatments, anatomy, anatomyTreatments = {} } = options;
    const rules = anatomy ? [...anatomyRules(anatomy, anatomyTreatments, treatments), ...styleRules] : styleRules;

    return rules.map(rule => {
        const target: StyleRuleTarget = { ...rule.target };
        if (anatomy?.context && target.context === undefined) {
            target.context = anatomy.context;
            if (anatomy.context === target.part) {
                target.part = undefined;
            }
        }
        const interactivity = { ...anatomy?.interactivity, ...(target.ignoreInteractivity ? Interactivity.always : {}) };
        return { properties: treatmentProperties(treatmentOf(rule, treatments)), params: { ...interactivity, ...target } };
    });
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
 * @param options - The tokens, the treatments the rules refer to, the anatomy, and the treatments the anatomy applies
 * @returns The rules of CSS
 *
 * @public
 */
export function renderStyleRules(styleRules: StyleRules, options: StyleRulesOptions): CssRule[] {
    return effectiveRules(styleRules, options).flatMap(({ properties, params }) => renderRules(properties, params, options.tokens));
}

/**
 * Gets the values on a fill of the style rules of a component, each with its fill, for the CSS of the tokens, see {@link onFillCSS}.
 *
 * @param styleRules - The style rules of the component
 * @param options - The treatments the rules refer to, the anatomy, and the treatments the anatomy applies
 * @returns The values on a fill
 *
 * @public
 */
export function styleRulesOnFills(
    styleRules: StyleRules,
    options: Pick<StyleRulesOptions, "treatments" | "anatomy" | "anatomyTreatments">
): OnFillWithFill[] {
    return effectiveRules(styleRules, options).flatMap(({ properties }) => onFillsOf(properties));
}
