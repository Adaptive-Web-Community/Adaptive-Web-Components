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
    ElementStylesRenderer,
    type InteractivityDefinition,
    type StyleModuleEvaluateParameters,
    type StyleModuleTarget,
    Styles,
} from "@adaptive-web/adaptive-ui";
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
    ) {}

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
        defaultStyles: ComposableStyles[], interactivity?: InteractivityDefinition, options?: ComposeOptions<any>
    ): ElementStyles {
        const componentStyles: ComposableStyles[] = options?.styles ? 
            (Array.isArray(options.styles) ? options.styles : new Array(options.styles)) :
            defaultStyles;

        if (options?.styleModules) {
            for (const [target, styles] of options.styleModules) {
                const params: StyleModuleEvaluateParameters = Object.assign({}, interactivity, target);
                const renderedStyles = new ElementStylesRenderer(styles).render(params);
                componentStyles.push(renderedStyles);
            }
        }

        return new ElementStyles(componentStyles);
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
    styleModules?: Iterable<readonly [StyleModuleTarget, Styles]>;
    shadowOptions?: Partial<ShadowRootOptions>;
    elementOptions?: ElementDefinitionOptions;
    statics?: Record<TStatics, StaticallyComposableHTML>;
}
