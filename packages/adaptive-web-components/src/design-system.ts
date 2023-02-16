import { StaticallyComposableHTML } from "@microsoft/fast-foundation";

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
    options: PartialDesignSystem = {},
    designSystem: PartialDesignSystem = DefaultDesignSystem
): DesignSystem {
    return Object.freeze({
        ...designSystem,
        ...options
    }) as DesignSystem;
}