import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { makeSelector } from "./selector.js";
import type { FocusSelector, StyleModuleEvaluate, StyleModuleEvaluateParameters } from "./types.js";

export function attribute(
    attribute: string,
    value: string | CSSDesignToken<any>,
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): ElementStyles =>
        css`${makeSelector(params)} { ${attribute}: ${value}; }`;
}

export function attributeInteractive(
    attribute: string,
    rest: string | CSSDesignToken<any>,
    hover?: string | CSSDesignToken<any>,
    active?: string | CSSDesignToken<any>,
    focus?: string | CSSDesignToken<any>,
    focusSelector: FocusSelector = "focus-visible",
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): ElementStyles => css`
        ${makeSelector(params)} { ${attribute}: ${rest}; }
        ${
            hover
                ? css.partial`${makeSelector(params, "hover")} { ${attribute}: ${hover}; }`
                : ``
        }
        ${
            active
                ? css.partial`${makeSelector(params, "active")} { ${attribute}: ${active}; }`
                : ``
        }
        ${
            focus
                ? css.partial`${makeSelector(params, focusSelector)} { ${attribute}: ${focus}; }`
                : ``
        }
    `;
}
