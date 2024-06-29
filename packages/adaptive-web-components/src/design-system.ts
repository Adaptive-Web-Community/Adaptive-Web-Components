import {
    type ComposableStyles,
    ElementStyles,
    type ElementViewTemplate,
    FASTElementDefinition,
    type PartialFASTElementDefinition,
    type ShadowRootOptions,
} from '@microsoft/fast-element';
import type { StaticallyComposableHTML } from "@microsoft/fast-foundation";
import {
    type ComponentAnatomy,
    ElementStylesRenderer,
    StyleModuleTarget,
    StyleRule,
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { disabledStyles, focusIndicatorStyles, focusResetStyles } from "@adaptive-web/adaptive-ui/reference";
import type {
    AccordionItemStatics,
    BreadcrumbItemStatics,
    CheckboxStatics,
    ComboboxStatics,
    FlipperStatics,
    MenuItemStatics,
    NumberFieldStatics,
    RadioStatics,
    SelectStatics,
    TreeItemStatics
} from "./components/index.js";

type ComponentStatics =
    AccordionItemStatics
    | BreadcrumbItemStatics
    | CheckboxStatics
    | ComboboxStatics
    | FlipperStatics
    | MenuItemStatics
    | NumberFieldStatics
    | RadioStatics
    | SelectStatics
    | TreeItemStatics;

/**
 * Represents partial metadata configuration for a custom element.
 * 
 * @beta
 */
export type PartialDesignSystem = Partial<DesignSystem>;

/**
 * @beta
 */
export type ElementStaticMap = Map<ComponentStatics, StaticallyComposableHTML>;

/**
 * Represents metadata configuration for a custom element.
 * 
 * @beta
 */
export class DesignSystem {
    constructor(
        private _prefix: string,
        private _registry: CustomElementRegistry = customElements,
        private _statics: ElementStaticMap = new Map(),
    ) {
        // Register the global styles with the renderer.
        ElementStylesRenderer.disabledStyles = disabledStyles;
        ElementStylesRenderer.focusStateStyles = focusIndicatorStyles;
        ElementStylesRenderer.focusResetStyles = focusResetStyles;
    }

    public get prefix() {
        return this._prefix;
    }

    public get registry() {
        return this._registry;
    }

    public get statics() {
        return this._statics;
    }

    /**
     * Overrides DesignSystem properties.
     * 
     * @beta
     */
    public configure(options: PartialDesignSystem): this {
        this._prefix = options.prefix ?? this._prefix;
        this._registry = options.registry ?? this._registry;
        this._statics = options.statics ?? this._statics;

        return this;
    }

    /**
     * Sets the element prefix.
     * 
     * @remarks
     * Can be chained with other methods on the DesignSystem class.
     * 
     * @beta
     */
    public withPrefix(prefix: string): this {
        this._prefix = prefix;
        return this;
    }

    /**
     * Defines a set of components using the prefix and registry defined with the DesignSystem
     * 
     * @beta
     */
    public defineComponents(components: Record<string, ((ds: DesignSystem) => FASTElementDefinition) | FASTElementDefinition>) {
        for (const key in components) {
            let definition = components[key];

            if (typeof definition === 'function') {
                definition(this).define();
            } else if (definition instanceof FASTElementDefinition) {
                const elementNameParts = definition.name.split('-');
                const prefix = elementNameParts.shift();

                if (prefix !== this._prefix) {
                    const newDefinition = {
                        ...(definition as unknown as PartialFASTElementDefinition),
                        name: `${this._prefix}-${elementNameParts.join('-')}`
                    };

                    definition = FASTElementDefinition.compose(definition.type, newDefinition);
                }

                definition.define(this._registry);
            }
        }
    }

    /**
     * Checks a StyleRule for a target `part` and turns it into a class name.
     *
     * @remarks
     * This Design System is local to AWC and all templates and anatomy are structured this way.
     * The opinion of using class names used to exist in AUI, but AUI is now non-opinionated in this regard.
     *
     * @param styleRule - The StyleRule to check and update
     * @returns The updated StyleRule.
     */
    private static updateStyleRulesParts(styleRule: StyleRule): StyleRule {
        if (styleRule.target) {
            DesignSystem.updateTargetParts(styleRule.target);
        }
        return styleRule;
    }

    /**
     * Checks a `StyleModuleTarget` for `part` and turns it into a class name.
     *
     * @remarks
     * This Design System is local to AWC and all templates and anatomy are structured this way.
     * The opinion of using class names used to exist in AUI, but AUI is now non-opinionated in this regard.
     *
     * @param styleRule - The StyleModuleTarget to check and update
     * @returns The updated StyleModuleTarget.
     */
    private static updateTargetParts(target: StyleModuleTarget): StyleModuleTarget {
        if (target.part && !target.part.startsWith(".")) {
            target.part = "." + target.part;
        }
        return target;
    }

    /**
     * Assembles the collection of intended styles, evaluating and injecting modular styling if provided.
     *
     * @param defaultStyles - The default collection of styles to use if not overridden by `options.styles`.
     * @param interactivity - The interactivity selectors for the component.
     * @param options - The component options, using `styles` and `styleModules`.
     * @returns The collection of desired styles.
     * 
     * @beta
     */
    public static assembleStyles(
        defaultStyles: ComposableStyles[], anatomy?: ComponentAnatomy<any, any>, options?: ComposeOptions<any>
    ): ElementStyles {
        const componentStyles: ComposableStyles[] = options?.styles ? 
            (Array.isArray(options.styles) ? options.styles : new Array(options.styles)) :
            defaultStyles;

        const allStyleModules = options && options.styleModules ? options.styleModules.map(DesignSystem.updateStyleRulesParts) : [];

        if (anatomy?.focus) {
            if (anatomy.focus.focusTarget) {
                DesignSystem.updateTargetParts(anatomy.focus.focusTarget);
            }
            if (anatomy.focus.resetTarget) {
                DesignSystem.updateTargetParts(anatomy.focus.resetTarget);
            }
        }

        return ElementStylesRenderer.renderStyleRules(componentStyles, allStyleModules, anatomy);
    }
}

/**
 * The default {@link DesignSystem} configuration.
 *
 * @beta
 */
export const DefaultDesignSystem: DesignSystem = new DesignSystem("adaptive");

/**
 * Configuration options for composing an element definition.
 * 
 * @internal
 */
export type ComposeOptions<TSource, TStatics extends string = any> = {
    template?: (ds: DesignSystem) => ElementViewTemplate<TSource, any>;
    styles?: ElementStyles | ElementStyles[];
    styleModules?: StyleRules;
    shadowOptions?: Partial<ShadowRootOptions>;
    elementOptions?: ElementDefinitionOptions;
    statics?: Record<TStatics, StaticallyComposableHTML>;
}
