import type { DesignSystem, PartialDesignSystem } from "./design-system.js";
import { DefaultDesignSystem } from "./design-system.js";

export * from "./design-system.js";
export * from "./components/index.js";
export { AllComponents } from "./custom-elements.js";

export interface AdaptiveDesignSystem {
	designSystem: DesignSystem;
	configureDesignSystem(options?: PartialDesignSystem, designSystem?: DesignSystem): this;
	withPrefix(prefix: string): this;
	defineAllComponents(registry?: CustomElementRegistry): void;
}

/**
 * The default DesignSystem.
 * 
 * @remarks
 * Can be used to quickly define and use the adaptive web components.
 * 
 * @beta
 */
export default DefaultDesignSystem;