import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import type { InteractiveTokenSet, Styles } from "../types.js";
import { makeSelector } from "./selector.js";
import type { FocusSelector, StyleModuleEvaluateParameters } from "./types.js";

type StyleModuleEvaluate = (params: StyleModuleEvaluateParameters) => ElementStyles;

function property<T = string>(
    property: string,
    value: string | CSSDesignToken<T>,
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): ElementStyles =>
        css`${makeSelector(params)} { ${property}: ${value}; }`;
}

function propertyInteractive<T = string>(
    property: string,
    values: InteractiveTokenSet<T>,
    focusSelector: FocusSelector = "focus-visible",
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): ElementStyles => css`
        ${makeSelector(params)} { ${property}: ${values.rest}; }
        ${
            values.hover
                ? css.partial`${makeSelector(params, "hover")} { ${property}: ${values.hover}; }`
                : ``
        }
        ${
            values.active
                ? css.partial`${makeSelector(params, "active")} { ${property}: ${values.active}; }`
                : ``
        }
        ${
            values.focus
                ? css.partial`${makeSelector(params, focusSelector)} { ${property}: ${values.focus}; }`
                : ``
        }
    `;
}

function createElementStyleModules(styles: Styles): StyleModuleEvaluate[] {
    const modules: StyleModuleEvaluate[] = [];
    for (const key in styles) {
        const value = styles[key];
        if (typeof value === "string" || value instanceof CSSDesignToken) {
            const ev = property(key, value as CSSDesignToken<any>);
            modules.push(ev);
        } else {
            const ev = propertyInteractive(key, value as InteractiveTokenSet<any>);
            modules.push(ev);
        }
    }
    return modules;
}

function createElementStyles(modules: StyleModuleEvaluate[], params: StyleModuleEvaluateParameters): ElementStyles[] {
    return modules.map((module) =>
        module(params)
    );
}

/**
 * Convert style definitions to `ElementStyles`.
 *
 * @param styles - A collection of individual styling properties.
 * @param params - Parameters for creating the selectors for component states.
 * @returns An array of `ElementStyles`.
 *
 * @public
 */
export function renderElementStyles(styles: Styles, params: StyleModuleEvaluateParameters): ElementStyles[] {
    return createElementStyles(createElementStyleModules(styles), params);
}
