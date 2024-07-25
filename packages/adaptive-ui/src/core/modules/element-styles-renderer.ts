import { ComposableStyles, css, HostBehavior } from "@microsoft/fast-element";
import { type CSSDirective, ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { Interactivity, type InteractivityDefinition, type StyleModuleTarget, StyleProperty } from "../modules/types.js";
import { InteractiveState, InteractiveValues } from "../types.js";
import { makeSelector } from "./selector.js";
import type { ComponentAnatomy, StyleModuleEvaluateParameters, StylePropertyCss, StyleRules } from "./types.js";
import { stylePropertyToCssProperty } from "./css.js";
import { convertStylesToFocusState, Styles } from "./styles.js";

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
        state: InteractiveState,
    ): DeclarationMap {
        const cssProperty = property in StyleProperty ?
            stylePropertyToCssProperty(property as keyof typeof StyleProperty) :
            property;
        const map = new Map([[cssProperty, value]]);

        // TODO: This belongs in a plugin as described above.
        if (state === InteractiveState.rest) {
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
                [makeSelector(params, InteractiveState.rest), ElementStylesRenderer.declaration(property, value, InteractiveState.rest)]
            ]);
        }
    }

    private static propertyInteractive(
        property: StylePropertyCss,
        values: InteractiveValues<any>,
    ): StyleModuleEvaluate {
        return (params: StyleModuleEvaluateParameters): RuleMap => {
            const selectors: RuleMap = new Map();

            if (values.rest) {
                selectors.set(
                    makeSelector(params, InteractiveState.rest),
                    ElementStylesRenderer.declaration(property, values.rest, InteractiveState.rest)
                );
            }

            if (params.interactive !== undefined) {
                if (values.hover) {
                    selectors.set(
                        makeSelector(params, InteractiveState.hover),
                        ElementStylesRenderer.declaration(property, values.hover, InteractiveState.hover)
                    );
                }
                if (values.focus) {
                    selectors.set(
                        makeSelector(params, InteractiveState.focus),
                        ElementStylesRenderer.declaration(property, values.focus, InteractiveState.focus)
                    );
                }
                if (values.active) {
                    selectors.set(
                        makeSelector(params, InteractiveState.active),
                        ElementStylesRenderer.declaration(property, values.active, InteractiveState.active)
                    );
                }
            }

            if (params.disabled !== undefined && values.disabled) {
                selectors.set(
                    makeSelector(params, InteractiveState.disabled),
                    ElementStylesRenderer.declaration(property, values.disabled, InteractiveState.disabled)
                );
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
                return ElementStylesRenderer.propertyInteractive(property, value as InteractiveValues<any>);
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
        const effectiveInteractivity = interactivity || {};
        if (target.ignoreInteractivity === true) {
            Object.assign(effectiveInteractivity, Interactivity.always);
        }
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
     * Styles to merge in for any `ComponentAnatomy` which defines a `disabled` state.
     */
    public static disabledStyles: Styles;

    private static _focusStateStyles: Styles;
    private static _focusStateStylesAdjusted: Styles;

    /**
     * Styles to merge in for any `ComponentAnatomy` which defines a `focus` state.
     */
    public static get focusStateStyles(): Styles {
        return ElementStylesRenderer._focusStateStyles;
    }

    public static set focusStateStyles(styles: Styles) {
        ElementStylesRenderer._focusStateStyles = styles;
        ElementStylesRenderer._focusStateStylesAdjusted = convertStylesToFocusState(styles);
    }

    private static _focusResetStyles: Styles;
    private static _focusResetStylesAdjusted: Styles;

    /**
     * Styles to merge in for any `ComponentAnatomy` which defines a `focus` reset target.
     */
    public static get focusResetStyles(): Styles {
        return ElementStylesRenderer._focusResetStyles;
    }

    public static set focusResetStyles(styles: Styles) {
        ElementStylesRenderer._focusResetStyles = styles;
        ElementStylesRenderer._focusResetStylesAdjusted = convertStylesToFocusState(styles);
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
        const globalStyleRules: StyleRules = [];
        if (anatomy) {
            // If this component can be disabled, apply the style to all children.
            if (ElementStylesRenderer.disabledStyles && anatomy.interactivity?.disabled !== undefined) {
                // Focus and disabled are related in the way that they define the footprint of an indicator:
                // - In the case of focus, the indicator is typically the focus ring on the interactive element
                // - In the case of disabled, the indicator is typically the `not-allowed` cursor
                // Here we use the detailed description of the interactive and focusable elements to inform where to
                // apply the disabled styles.
                // The core problem we're trying to solve for here is to not show the disabled cursor over empty space
                // in a composed components, for example, in the upper right area beside the label and above the input
                // control in a typical input component like a Text Field.
                // If the focus is applied to the context (the `part` is undefined) then we should also apply the disabled
                // state to the context (also the `part` is undefined).
                const disabledPart = (anatomy.focus && anatomy.focus.focusTarget.part) ? "*" : undefined;
                globalStyleRules.push(
                    {
                        target : {
                            contextCondition: anatomy.interactivity.disabled,
                            part: disabledPart,
                        },
                        styles: ElementStylesRenderer.disabledStyles,
                    },
                );
            }

            // If this component can get focus, apply the focus indicator styles.
            if (anatomy.focus) {
                if (ElementStylesRenderer._focusResetStylesAdjusted && anatomy.focus?.resetTarget) {
                    globalStyleRules.push(
                        {
                            target: anatomy.focus?.resetTarget,
                            styles: ElementStylesRenderer._focusResetStylesAdjusted,
                        }
                    );
                }

                // Set intentional focus styles
                if (ElementStylesRenderer._focusStateStylesAdjusted) {
                    globalStyleRules.push(
                        {
                            target: anatomy.focus.focusTarget,
                            styles: ElementStylesRenderer._focusStateStylesAdjusted,
                        }
                    );
                }
            }
        }

        const allStyleRules = [...globalStyleRules, ...styleRules];
        for (const rule of allStyleRules) {
            const styles = Styles.fromDeclaration(rule);

            // Transform the target selector if necessary
            const target = rule.target || {} as StyleModuleTarget;
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
