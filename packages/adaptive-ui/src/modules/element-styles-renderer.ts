import { ComposableStyles, css, HostBehavior } from "@microsoft/fast-element";
import { type CSSDirective, ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { Interactivity, type InteractivityDefinition, type StyleModuleTarget, StyleProperty } from "../modules/types.js";
import type { InteractiveSet } from "../types.js";
import { makeSelector } from "./selector.js";
import type { ComponentAnatomy, StateSelector, StyleModuleEvaluateParameters, StylePropertyCss, StyleRules } from "./types.js";
import { stylePropertyToCssProperty } from "./css.js";
import { Styles } from "./styles.js";

/**
 * The properties and values of a css declaration.
 */
type DeclarationMap = Map<string, string | number | CSSDirective>;

/**
 * The selector and set of declarations for a css rule.
 */
type RuleMap = Map<string, DeclarationMap>;

/**
 * A function that converts style definitions to rules.
 */
type StyleModuleEvaluate = (params: StyleModuleEvaluateParameters) => RuleMap;

/**
 * Renders Adaptive UI Styles as ElementStyles.
 *
 * @public
 */
export class ElementStylesRenderer {
    private readonly _evaluateFunctions: StyleModuleEvaluate[];

    /**
     * The rules produced by evaluating the provided `Styles`.
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

    private static declaration(
        property: StylePropertyCss,
        value: string | number | CSSDirective,
        state?: StateSelector,
    ): DeclarationMap {
        const cssProperty = property in StyleProperty ?
            stylePropertyToCssProperty(property as keyof typeof StyleProperty) :
            property;
        const map = new Map([[cssProperty, value]]);

        // TODO: This belongs in a plugin as described above.
        if (state === undefined) {
            if (property === StyleProperty.foregroundFill) {
                map.set("fill", "currentcolor");
            }
        }
        return map;
    }

    private static propertySingle(
        property: StylePropertyCss,
        value: string | number | CSSDirective,
    ): StyleModuleEvaluate {
        return (params: StyleModuleEvaluateParameters): RuleMap => {
            return new Map([
                [makeSelector(params), ElementStylesRenderer.declaration(property, value)]
            ]);
        }
    }

    private static propertyInteractive(
        property: StylePropertyCss,
        values: InteractiveSet<any>,
    ): StyleModuleEvaluate {
        return (params: StyleModuleEvaluateParameters): RuleMap => {
            const selectors: RuleMap = new Map();

            if (values.rest) {
                selectors.set(makeSelector(params), ElementStylesRenderer.declaration(property, values.rest));
            }
            if (params.interactivitySelector !== undefined && values.hover) {
                selectors.set(makeSelector(params, "hover"), ElementStylesRenderer.declaration(property, values.hover, "hover"));
            }
            if (params.interactivitySelector !== undefined && values.active) {
                selectors.set(makeSelector(params, "active"), ElementStylesRenderer.declaration(property, values.active, "active"));
            }
            if (params.interactivitySelector !== undefined && values.focus) {
                const selector = params.focusSelector || "focus-visible";
                selectors.set(makeSelector(params, selector), ElementStylesRenderer.declaration(property, values.focus, selector));
            }

            if (params.disabledSelector !== undefined && values.disabled) {
                selectors.set(makeSelector(params, "disabled"), ElementStylesRenderer.declaration(property, values.disabled, "disabled"));
            }

            return selectors;
        }
    }

    private createStyleModules(styles: Styles): StyleModuleEvaluate[] {
        const modules: StyleModuleEvaluate[] = new Array(...styles.effectiveProperties.entries()).map(([property, value]) => {
            if (typeof value === "string" || typeof value === "number" || value instanceof CSSDesignToken) {
                return ElementStylesRenderer.propertySingle(property, value);
            } else if (value && typeof (value as any).createCSS === "function") {
                return ElementStylesRenderer.propertySingle(property, value as CSSDirective);
            } else {
                return ElementStylesRenderer.propertyInteractive(property, value as InteractiveSet<any>);
            }
        });
        return modules;
    }

    private appendRule(selector: string, declarations: DeclarationMap) {
        const cssProperties = new Array(...declarations.entries()).map(([property, value]) => {
            const valueToUse = typeof value === "number" ? value.toString() : value;
            return css.partial`${property}: ${valueToUse};`;
        });
        if (this._rules.has(selector)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._rules.get(selector)!.push(...cssProperties);
        } else {
            this._rules.set(selector, cssProperties);
        }
    }

    /**
     * Convert style definitions to `ElementStyles`.
     *
     * @param target - Parameters for creating the selectors for component states.
     * @param interactivity - The interactivity configuration for the component.
     * @returns The rendered `ElementStyles`.
     */
    public render(target: StyleModuleTarget, interactivity?: InteractivityDefinition): ElementStyles {
        // Construct the evaluation params, not including interactivity if requested
        const effectiveInteractivity = (target.ignoreInteractivity === true) ? Interactivity.always : interactivity;
        const params: StyleModuleEvaluateParameters = Object.assign({}, effectiveInteractivity, target);

        // Combine the selectors
        this._evaluateFunctions.forEach((module) => {
            const rule = module(params);
            for (const ruleEntry of rule) {
                this.appendRule(ruleEntry[0], ruleEntry[1]);
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

    /**
     * Convert style rule definitions to `ElementStyles`.
     *
     * @param baseStyles - Any base styles to append style rules to.
     * @param styleRules - Adaptive UI style rules.
     * @param anatomy - Optional component anatomy for features including interactivity and focus definition.
     * @returns The rendered `ElementStyles`.
     */
    public static renderStyleRules(baseStyles: ComposableStyles[] = [], styleRules: StyleRules, anatomy?: ComponentAnatomy<any, any>) {
        for (const rule of styleRules) {
            const styles = Styles.fromDeclaration(rule);

            // Transform the target selector if necessary
            const target = rule.target || {};
            if (anatomy?.context && target.context === undefined) {
                target.context = anatomy.context;
                if (anatomy.context === target.part) {
                    target.part = undefined;
                }
            }

            const renderedStyles = new ElementStylesRenderer(styles).render(target, anatomy?.interactivity);
            baseStyles.push(renderedStyles);
        }

        return new ElementStyles(baseStyles);
    }
}
