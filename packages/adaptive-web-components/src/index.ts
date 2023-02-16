import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { DesignSystem, PartialDesignSystem } from "./design-system.js";
import { configureDesignSystem, DefaultDesignSystem } from "./design-system.js";
import { AllComponents } from "./custom-elements.js";

export type { DesignSystem } from "./design-system.js";
export * from "./components/index.js";

export interface AdaptiveDesignSystem {
	designSystem: DesignSystem;
	configureDesignSystem(options: PartialDesignSystem): this;
	withPrefix(prefix: string): this;
	defineAllComponents(registry: CustomElementRegistry): void;
}

export default {
	designSystem: DefaultDesignSystem,
	configureDesignSystem(options: PartialDesignSystem) {
		this.designSystem = configureDesignSystem(options)
		return this;
	},
	withPrefix(prefix: string) {
		this.designSystem = configureDesignSystem({ prefix }, this.designSystem);
		return this;
	},
	defineAllComponents(registry: CustomElementRegistry = customElements) {
		for (const key in AllComponents) {
			(AllComponents as Record<string, (ds: DesignSystem) => FASTElementDefinition>)[key](this.designSystem)
				.define(registry);
		}
	}
} as AdaptiveDesignSystem;