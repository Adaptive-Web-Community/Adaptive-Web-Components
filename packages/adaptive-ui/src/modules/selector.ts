import type { StateSelector, StyleModuleEvaluateParameters } from "./types.js";

const defaultHost = ":host";

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
    const host = params.host && params.host !== defaultHost ? `.${params.host}` : defaultHost;

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

                // If this is not targeting a part, or if configured, apply the state at the `:host`.
                if (!params.part || params.stateOnHost === true) {
                    hostCondition += statePseudo;
                }
            } else {
                // Add the non-interactive condition like `[disabled]`.
                hostCondition += (params.disabledSelector || "");
            }
        }

        if (hostCondition !== "") {
            const hostSelector = host === defaultHost ? `${host}(${hostCondition})` : `${host}${hostCondition}`;
            selectors.push(hostSelector);
        }
    } else if (!params.part) {
        // There wasn't a host condition, and there isn't a part, so basic host selector.
        selectors.push(host);
    }

    if (params.part) {
        if (params.part === "*") {
            selectors.push("*");
        } else {
            // Using class selector notation for now.
            selectors.push(`.${params.part}${params.partCondition || ""}${params.stateOnHost !== true ? statePseudo : ""}`);
        }
    }
    const ret = selectors.join(" ");
    // console.log("makeSelector", ret);
    return ret;
}
