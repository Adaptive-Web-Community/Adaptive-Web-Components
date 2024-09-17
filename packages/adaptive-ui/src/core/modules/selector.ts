import { InteractiveState, InteractiveValues } from "../types.js";
import type { StyleModuleEvaluateParameters } from "./types.js";

const HOST_CONTEXT = ":host";

const defaultContext = HOST_CONTEXT;

/**
 * Default css selectors for an interactive element's states.
 */
const DefaultInteractiveSelectors: InteractiveValues<string> = {
    rest: "",
    hover: ":hover",
    active: ":active",
    focus: ":focus-visible",
    disabled: "",
};

/**
 * Creates a single css selector for the provided `params` and `state`.
 *
 * @param params - Parameters for the selector.
 * @param state - The interactive state.
 * @returns A css selector string.
 *
 * @public
 */
export function makeSelector(params: StyleModuleEvaluateParameters, state: InteractiveState): string {
    const selectors: string[] = [];

    const rest = state === InteractiveState.rest;
    const disabled = state === InteractiveState.disabled;

    const stateSelector = disabled ? "" : params[state] || DefaultInteractiveSelectors[state];
    const context = params.context && params.context !== defaultContext ? params.context : defaultContext;

    // Check for anything that will generate a condition on the context
    if (params.contextCondition ||
        (!rest && !disabled && params.interactive !== undefined) ||
        (!rest && disabled && params.disabled !== undefined)
    ) {
        // Start with any base context element condition like `[appearance='accent']`.
        let contextCondition = params.contextCondition || "";

        if (state !== InteractiveState.rest) {
            if (!disabled) {
                // Add any interactive condition like `:not([disabled])`.
                contextCondition += (params.interactive || "");

                // If this is not targeting a part, or if configured, apply the state on the context element.
                if (!params.part || params.stateOnContext === true) {
                    contextCondition += stateSelector;
                }
            } else {
                // Add the non-interactive condition like `[disabled]`.
                contextCondition += (params.disabled || "");
            }
        }

        if (contextCondition !== "") {
            const contextSelector = context === HOST_CONTEXT ? `${HOST_CONTEXT}(${contextCondition})` : `${context}${contextCondition}`;
            selectors.push(contextSelector);
        }
    }

    // There wasn't a context condition, and there isn't a part, so basic context element selector.
    if (selectors.length === 0 && (context !== HOST_CONTEXT || !params.part)) {
        selectors.push(context);
    }

    // Add the part selector
    if (params.part) {
        if (params.part === "*") {
            selectors.push(" *");
        } else if (params.part.startsWith("::")) {
            selectors.push(params.part);
        } else {
            selectors.push(` ${params.part}${params.partCondition || ""}${params.stateOnContext !== true ? stateSelector : ""}`);
        }
    }

    return selectors.join("");
}
