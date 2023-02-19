import { ElementViewTemplate, FASTElement, FASTElementDefinition, PartialFASTElementDefinition } from '@microsoft/fast-element';
import { StaticallyComposableHTML } from "@microsoft/fast-foundation";

/**
 * Represents partial metadata configuration for a custom element.
 * 
 * @beta
 */
export type PartialDesignSystem = Partial<DesignSystem>;

/**
 * Represents metadata configuration for a custom element.
 * 
 * @beta
 */
export class DesignSystem {
    constructor(
        private _prefix: string,
        private _registry: CustomElementRegistry = customElements,
        private _statics: Map<string, StaticallyComposableHTML> = new Map(),
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
 * Configuration options for an element definition.
 * 
 * @public
 */
export interface PartialAdaptiveDefinition extends Omit<PartialFASTElementDefinition, "registry" | "template"> {
    readonly template?: ((ds: DesignSystem) => ElementViewTemplate);
}

/**
 * Helper for creating element definitions using the {@link DefaultDesignSystem} or a custom {@link DesignSystem}
 * 
 * @public
 */
export function createAdaptiveDefinition<T extends typeof FASTElement>(
    ctor: T,
    options: PartialAdaptiveDefinition,
    designSystem: DesignSystem = DefaultDesignSystem
): (ds?: DesignSystem) => FASTElementDefinition {

    return (ds: DesignSystem = designSystem) => ctor.compose({
        name: `${ds.prefix}-${options.name}`,
        template: options?.template?.(ds),
        styles: options.styles,
        attributes: options.attributes,
        elementOptions: options.elementOptions,
        shadowOptions: options.shadowOptions,
        registry: ds.registry,
    });
}