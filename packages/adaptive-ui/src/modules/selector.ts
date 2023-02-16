import type { StateSelector, StyleModuleEvaluateParameters } from "./types.js";

export function makeSelector(params: StyleModuleEvaluateParameters, state?: StateSelector): string {
    const selectors: string[] = [];

    if (params.hostCondition || (state && params.interactivitySelector)) {
        // Use any base host condition like `[appearance='accent']`.
        let hostCondition = params.hostCondition || "";

        // Add any interactive condition like `:not([disabled])`.
        hostCondition += (params.interactivitySelector || "");

        // If this is not targeting a part, apply the state at the `:host`.
        if (!params.part && state) {
            hostCondition += ":" + state;
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
