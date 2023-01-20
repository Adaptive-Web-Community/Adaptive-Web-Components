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
}

/**
 * The default {@link DesignSystem} configuration.
 */
export const DefaultDesignSystem = Object.freeze({
    prefix: "adaptive",
} as DesignSystem);
