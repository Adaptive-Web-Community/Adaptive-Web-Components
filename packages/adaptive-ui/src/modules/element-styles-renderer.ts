import { css } from "@microsoft/fast-element";
import type { CSSDirective, ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import type { StyleProperty } from "../modules/types.js";
import type { InteractiveTokenSet } from "../types.js";
import { makeSelector } from "./selector.js";
import type { FocusSelector, StyleModuleEvaluateParameters } from "./types.js";
import { stylePropertyToCssProperty } from "./css.js";
import { Styles } from "./styles.js";

type StyleModuleEvaluate = (params: StyleModuleEvaluateParameters) => ElementStyles;

function propertySingle<T = string>(
    property: string,
    value: string | CSSDesignToken<T> | CSSDirective,
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
            params.interactivitySelector !== undefined && values.hover
                ? css.partial`${makeSelector(params, "hover")} { ${property}: ${values.hover}; }`
                : ``
        }
        ${
            params.interactivitySelector !== undefined && values.active
                ? css.partial`${makeSelector(params, "active")} { ${property}: ${values.active}; }`
                : ``
        }
        ${
            params.interactivitySelector !== undefined && values.focus
                ? css.partial`${makeSelector(params, focusSelector)} { ${property}: ${values.focus}; }`
                : ``
        }
    `;
}

function createElementStyleModules(styles: Styles): StyleModuleEvaluate[] {
    const modules: StyleModuleEvaluate[] = Object.entries(styles.properties).map(([key, value]) => {
        const property = stylePropertyToCssProperty(key as StyleProperty);
        if (typeof value === "string" || value instanceof CSSDesignToken) {
            return propertySingle(property, value);
        } else if (value && typeof (value as any).createCSS === "function") {
            return propertySingle(property, value as CSSDirective);
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
