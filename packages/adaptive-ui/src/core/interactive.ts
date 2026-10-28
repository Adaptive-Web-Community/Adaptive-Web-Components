import { isRef } from "design-token-library";

/**
 * An interactive element's states.
 *
 * @public
 */
export enum InteractiveState {
    /**
     * The rest state.
     */
    rest = "rest",

    /**
     * The hover state.
     */
    hover = "hover",

    /**
     * The active state.
     */
    active = "active",

    /**
     * The focus state.
     */
    focus = "focus",

    /**
     * The disabled state.
     */
    disabled = "disabled",
}

/**
 * Values for an interactive element's states, one for each of them.
 *
 * @deprecated Use {@link InteractiveSet}, in which every state is optional, or `Record<InteractiveState, T>` where there has to be one for each.
 * @public
 */
export type InteractiveValues<T> = {
    [key in InteractiveState]: T;
}

/**
 * The values of the states that an interactive element has, which are the ones that are given: a state that is not there has no value from this
 * set, and a state that is `null` is cleared on purpose.
 *
 * @remarks
 * A set doesn't need a value for every state, or for the `rest`: a ring that is only for the focus, or a lift that is only on hover, has just that one.
 * What a state that has no value does is for the styles that read it.
 *
 * @public
 */
export type InteractiveSet<T> = {
    [key in InteractiveState]?: T | null;
};

/**
 * Maps the states of a set that have a value, and gives a set with only those states.
 *
 * @remarks
 * A state that is not there, or is `undefined`, is not in the result, so a set that is spread over another one leaves that state as it was. A state that
 * is `null` is kept as `null`, since it is cleared on purpose. A recipe that makes a set from another set, or from the deltas of its states, uses it.
 *
 * @param set - The set to map
 * @param map - Gets the value of a state from the value it has in `set`
 * @returns A new set with the states of `set` that have a value
 *
 * @public
 */
export function mapStates<T, U>(set: InteractiveSet<T>, map: (value: T, state: InteractiveState) => U): InteractiveSet<U> {
    const result: InteractiveSet<U> = {};
    for (const state of Object.values(InteractiveState)) {
        const value = set[state];
        if (value === null) {
            result[state] = null;
        } else if (value !== undefined) {
            result[state] = map(value, state);
        }
    }
    return result;
}

const interactiveStates: ReadonlySet<string> = new Set(Object.values(InteractiveState));

/**
 * Checks if a value is a set of values for the states of an interactive element: an object whose keys are states. A ref, a color, a
 * dimension, or a shadow has other keys.
 *
 * @internal
 */
export function isInteractiveSet<T>(value: unknown): value is InteractiveSet<T> {
    if (typeof value !== "object" || value === null || Array.isArray(value) || isRef(value)) {
        return false;
    }
    const keys = Object.keys(value);
    return keys.length > 0 && keys.every(key => interactiveStates.has(key));
}
