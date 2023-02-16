import type { ElementStyles } from "@microsoft/fast-element";

export type FocusSelector = "focus" | "focus-visible" | "focus-within";

export type StateSelector = FocusSelector | "hover" | "active";

export interface StyleModuleEvaluateParameters {
    hostCondition?: string;
    part?: string;
    partCondition?: string;
    interactivitySelector?: string;
    nonInteractivitySelector?: string;
}

export type StyleModuleEvaluate = (params: StyleModuleEvaluateParameters) => ElementStyles;
