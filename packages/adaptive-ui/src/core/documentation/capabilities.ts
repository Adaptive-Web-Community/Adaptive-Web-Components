/**
 * Built-in behavior that remains true without product-specific handlers.
 *
 * @public
 */
export interface Capabilities {
    /**
     * Overview of what the component does on its own (Markdown).
     */
    readonly summary?: string;

    /**
     * Discrete capability statements keyed by stable ids.
     */
    readonly items?: readonly CapabilityItem[];
}

/**
 * One built-in capability of the component.
 *
 * @public
 */
export interface CapabilityItem {
    /**
     * Stable id for cross-references and changelog.
     */
    readonly id: string;

    /**
     * Description of the capability (Markdown).
     */
    readonly description: string;
}

/**
 * Capabilities section of a documentation record.
 *
 * @public
 */
export type CapabilitiesSection<TCapabilities extends Capabilities = Capabilities> = {
    readonly capabilities?: TCapabilities;
};
