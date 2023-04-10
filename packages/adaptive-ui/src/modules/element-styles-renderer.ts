import { css } from "@microsoft/fast-element";
import type { CSSDirective, ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import type { StyleProperty, Styles } from "../modules/types.js";
import type { InteractiveTokenSet } from "../types.js";
import { makeSelector } from "./selector.js";
import type { FocusSelector, StyleModuleEvaluateParameters } from "./types.js";
import { stylePropertyToCssProperty } from "./css.js";

type StyleModuleEvaluate = (params: StyleModuleEvaluateParameters) => ElementStyles;

function cssPartial(
    value: CSSDirective,
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): ElementStyles =>
        css`${makeSelector(params)} { ${value} }`;
}

function propertySingle<T = string>(
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
    const modules: StyleModuleEvaluate[] = Object.entries(styles).map(([key, value]) => {
        const property = stylePropertyToCssProperty(key as StyleProperty);
        if (typeof value === "string" || value instanceof CSSDesignToken) {
            return propertySingle(property, value);
        } else if (value && typeof (value as any).createCSS === "function") {
            return cssPartial(value as CSSDirective);
        } else {
            return propertyInteractive(property, value as InteractiveTokenSet<any>);
        }
    });
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
