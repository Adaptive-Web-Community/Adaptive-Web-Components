import { css, HostBehavior } from "@microsoft/fast-element";
import { type CSSDirective, ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import type { StyleProperty } from "../modules/types.js";
import type { InteractiveTokenGroup } from "../types.js";
import { makeSelector } from "./selector.js";
import type { FocusSelector, StyleModuleEvaluateParameters } from "./types.js";
import { stylePropertyToCssProperty } from "./css.js";
import { Styles } from "./styles.js";

type StyleModuleEvaluate = (params: StyleModuleEvaluateParameters) => Map<string, CSSDirective>;

/**
 * Renders Adaptive UI Styles as ElementStyles.
 *
 * @public
 */
export class ElementStylesRenderer {
    private readonly _evaluateFunctions: StyleModuleEvaluate[];

    /**
     * The key is the css selector and the value is an array of properties. 
     */
    private readonly _rules: Map<string, Array<CSSDirective>> = new Map();

    /**
     * Creates a new ElementStylesRenderer.
     *
     * @param styles - A collection of individual styling properties.
     */
    public constructor(styles: Styles) {
        this._evaluateFunctions = this.createStyleModules(styles);
    }

    // The structure of this class may seem odd, but the "modular" intention is that you can
    // inject other logic to produce more complicated or dependent css.
    // Perhaps these static functions turn into a registration mechanism.

    private static propertySingle(
        property: string,
        value: string | CSSDirective,
    ): StyleModuleEvaluate {
        return (params: StyleModuleEvaluateParameters): Map<string, CSSDirective> => {
            return new Map([
                [makeSelector(params), css.partial`${property}: ${value};`]
            ]);
        }
    }

    private static propertyInteractive(
        property: string,
        values: InteractiveTokenGroup<any>,
        focusSelector: FocusSelector = "focus-visible",
    ): StyleModuleEvaluate {
        return (params: StyleModuleEvaluateParameters): Map<string, CSSDirective> => {
            const selectors = new Map([
                [makeSelector(params), css.partial`${property}: ${values.rest};`]
            ]);

            if (params.interactivitySelector !== undefined && values.hover) {
                selectors.set(makeSelector(params, "hover"), css.partial`${property}: ${values.hover};`);
            }
            if (params.interactivitySelector !== undefined && values.active) {
                selectors.set(makeSelector(params, "active"), css.partial`${property}: ${values.active};`);
            }
            if (params.interactivitySelector !== undefined && values.focus) {
                selectors.set(makeSelector(params, focusSelector), css.partial`${property}: ${values.focus};`);
            }

            if (params.disabledSelector !== undefined && values.disabled) {
                selectors.set(makeSelector(params, "disabled"), css.partial`${property}: ${values.disabled};`);
            }

            return selectors;
        }
    }

    private createStyleModules(styles: Styles): StyleModuleEvaluate[] {
        const modules: StyleModuleEvaluate[] = new Array(...styles.effectiveProperties.entries()).map(([key, value]) => {
            const property = stylePropertyToCssProperty(key as StyleProperty);
            if (typeof value === "string" || value instanceof CSSDesignToken) {
                return ElementStylesRenderer.propertySingle(property, value);
            } else if (value && typeof (value as any).createCSS === "function") {
                return ElementStylesRenderer.propertySingle(property, value as CSSDirective);
            } else {
                return ElementStylesRenderer.propertyInteractive(property, value as InteractiveTokenGroup<any>);
            }
        });
        return modules;
    }

    private appendRule(selector: string, property: CSSDirective) {
        if (this._rules.has(selector)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._rules.get(selector)!.push(property);
        } else {
            this._rules.set(selector, [property]);
        }
    }

    /**
     * Convert style definitions to `ElementStyles`.
     *
     * @param params - Parameters for creating the selectors for component states.
     * @returns The rendered `ElementStyles`.
     */
    public render(params: StyleModuleEvaluateParameters): ElementStyles {
        // Combine the selectors
        this._evaluateFunctions.forEach((module) => {
            const map = module(params);
            for (const entry of map) {
                this.appendRule(entry[0], entry[1]);
            }
        });

        // Create the styles
        const behaviors: HostBehavior<HTMLElement>[] = [];
        const add = (behavior: HostBehavior<HTMLElement>): void => {
            behaviors.push(behavior);
        };

        const strings = [];

        for (const entry of this._rules) {
            const properties = entry[1].map((prop) => prop.createCSS(add)).join(" ");
            const rule = `${entry[0]} { ${properties} }`;
            strings.push(rule);
        }

        // This is the same thing the css template helper is doing.
        // https://github.com/microsoft/fast/blob/b78c921ec4e49ec9d7ec980f079ec114045df42e/packages/web-components/fast-element/src/styles/css.ts#L112
        const styles = new ElementStyles(strings);
        return behaviors.length > 0 ? styles.withBehaviors(...behaviors) : styles;
    }
}
