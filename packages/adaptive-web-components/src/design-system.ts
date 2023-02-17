import { FASTElementDefinition } from '@microsoft/fast-element';
import { StaticallyComposableHTML } from "@microsoft/fast-foundation";

/**
 * Represents metadata configuration for a custom element.
 *
 * @beta
 */
export interface DesignSystem {
    /**
     * The prefix for custom elements.
     */
    readonly prefix: string;

    /**
     * The registry to register components in by default.
     *
     * @remarks
     * If not provided, defaults to the global registry.
     */
    readonly registry?: CustomElementRegistry;

    /**
     * A map of static resources that are referenced by the components.
     */
    readonly statics: Map<string, StaticallyComposableHTML>;
}

/**
 * Represents partial metadata configuration for a custom element.
 * 
 * @beta
 */
export type PartialDesignSystem = Partial<DesignSystem>;

/**
 * @beta
 */
export class DesignSystem implements DesignSystem {
    constructor(
        private _prefix: string,
        private _registry: CustomElementRegistry = customElements,
        private _statics: Map<string, StaticallyComposableHTML> = new Map()
    ) {}

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
