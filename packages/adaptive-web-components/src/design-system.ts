import type { StaticallyComposableHTML } from "@microsoft/fast-foundation";
import type {
    ElementStyles,
    ElementViewTemplate,
    FASTElementDefinition,
    ShadowRootOptions
} from '@microsoft/fast-element';

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
            if (typeof components[key] === 'function') {
                (components[key] as (ds: DesignSystem) => FASTElementDefinition)(this).define();
            } else {
                (components[key] as FASTElementDefinition).define(this._registry);
            }
        }
    }
}

/**
 * The default {@link DesignSystem} configuration.
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
    shadowOptions?: Partial<ShadowRootOptions>;
    elementOptions?: ElementDefinitionOptions;
    statics?: Record<TStatics, StaticallyComposableHTML>;
}