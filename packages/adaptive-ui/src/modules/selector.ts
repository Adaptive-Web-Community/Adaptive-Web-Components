import type { StateSelector, StyleModuleEvaluateParameters } from "./types.js";

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

    if (params.hostCondition || (state && params.interactivitySelector !== undefined)) {
        // Use any base host condition like `[appearance='accent']`.
        let hostCondition = params.hostCondition || "";

        if (state) {
            // Add any interactive condition like `:not([disabled])`.
            hostCondition += (params.interactivitySelector || "");

            // If this is not targeting a part, apply the state at the `:host`.
            if (!params.part) {
                hostCondition += ":" + state;
            }
        }

        if (hostCondition !== "") {
            selectors.push(`:host(${hostCondition})`);
        }
    } else if (!params.part) {
        selectors.push(":host");
    }

    if (params.part) {
        // Using class selector notation for now.
        selectors.push(`.${params.part}${params.partCondition || ""}${state ? ":" + state : ""}`);
    }
    const ret = selectors.join(" ");
    // console.log("makeSelector", ret);
    return ret;
}
