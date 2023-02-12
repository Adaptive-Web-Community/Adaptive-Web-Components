import type { ElementViewTemplate, FASTElement, FASTElementDefinition, PartialFASTElementDefinition } from '@microsoft/fast-element';
import type { StaticallyComposableHTML } from "@microsoft/fast-foundation";

/**
 * Represents metadata configuration for a custom element.
 *
 * @public
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
 * @public
 */
export type PartialDesignSystem = Partial<DesignSystem>;

/**
 * The default {@link DesignSystem} configuration.
 */
export const DefaultDesignSystem: DesignSystem = Object.freeze({
    prefix: "adaptive",
    statics: new Map(),
});

/**
 * 
 * @remarks
 * Configures a custom design system by extending {@link DefaultDesignSystem}
 * 
 * @param options - {@link DesignSystem} property overrides
 */
export function configureDesignSystem(
    options: PartialDesignSystem = {}
): DesignSystem {
    return Object.freeze({
        ...DefaultDesignSystem,
        ...options
    }) as DesignSystem;
}

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