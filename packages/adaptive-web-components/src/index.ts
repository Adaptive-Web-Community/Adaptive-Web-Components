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

export default DefaultDesignSystem;