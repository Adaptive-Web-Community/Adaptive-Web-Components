import type { StateSelector, StyleModuleEvaluateParameters } from "./types.js";

const HOST_CONTEXT = ":host";

const defaultContext = HOST_CONTEXT;

/**
 * Creates a single css selector for the provided `params` and optional `state`.
 *
 * @param params - Parameters for the selector.
 * @param state - An optional interactive state.
 * @returns A css selector string.
 *
 * @public
 */
export function makeSelector(params: StyleModuleEvaluateParameters, state?: StateSelector): string {
    const selectors: string[] = [];

    // `disabled` is a `state`, but it's not a css pseudo selector.
    const statePseudo = state && state !== "disabled" ? ":" + state : "";
    const context = params.context && params.context !== defaultContext ? `.${params.context}` : defaultContext;

    if (params.contextCondition ||
        (state && state !== "disabled" && params.interactivitySelector !== undefined) ||
        (state && state === "disabled" && params.disabledSelector !== undefined)
    ) {
        // Start with any base context element condition like `[appearance='accent']`.
        let contextCondition = params.contextCondition || "";

        if (state) {
            if (state !== "disabled") {
                // Add any interactive condition like `:not([disabled])`.
                contextCondition += (params.interactivitySelector || "");

                // If this is not targeting a part, or if configured, apply the state on the context element.
                if (!params.part || params.stateOnContext === true) {
                    contextCondition += statePseudo;
                }
            } else {
                // Add the non-interactive condition like `[disabled]`.
                contextCondition += (params.disabledSelector || "");
            }
        }

        if (contextCondition !== "") {
            const contextSelector = context === HOST_CONTEXT ? `${HOST_CONTEXT}(${contextCondition})` : `${context}${contextCondition}`;
            selectors.push(contextSelector);
        }
    } else if (!params.part) {
        // There wasn't a context condition, and there isn't a part, so basic context element selector.
        selectors.push(context);
    }

    if (params.part) {
        if (params.part === "*") {
            selectors.push("*");
        } else {
            // Using class selector notation for now.
            selectors.push(`.${params.part}${params.partCondition || ""}${params.stateOnContext !== true ? statePseudo : ""}`);
        }
    }
    const ret = selectors.join(" ");
    // console.log("makeSelector", ret);
    return ret;
}
