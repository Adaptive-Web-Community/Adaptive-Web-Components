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

    if (params.hostCondition ||
        (state && state !== "disabled" && params.interactivitySelector !== undefined) ||
        (state && state === "disabled" && params.disabledSelector !== undefined)
    ) {
        // Start with any base host condition like `[appearance='accent']`.
        let hostCondition = params.hostCondition || "";

        if (state) {
            if (state !== "disabled") {
                // Add any interactive condition like `:not([disabled])`.
                hostCondition += (params.interactivitySelector || "");

                // If this is not targeting a part, apply the state at the `:host`.
                if (!params.part) {
                    hostCondition += ":" + state;
                }
            } else {
                // Add the non-interactive condition like `[disabled]`.
                hostCondition += (params.disabledSelector || "");
            }
        }

        if (hostCondition !== "") {
            selectors.push(`:host(${hostCondition})`);
        }
    } else if (!params.part) {
        // There wasn't a host condition, and there isn't a part, so basic host selector.
        selectors.push(":host");
    }

    if (params.part) {
        if (params.part === "*") {
            selectors.push("*");
        } else {
            // Using class selector notation for now.
            selectors.push(`.${params.part}${params.partCondition || ""}${state && state !== "disabled" ? ":" + state : ""}`);
        }
    }
    const ret = selectors.join(" ");
    // console.log("makeSelector", ret);
    return ret;
}
