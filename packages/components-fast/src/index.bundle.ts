import type { ComponentDefinition, DesignSystem } from './design-system.js';
import { AllComponents } from './custom-elements.js';
import { DefaultDesignSystem } from './design-system.js';

declare global {
	// eslint-disable-next-line no-var
	var AWC: any;
}

interface AWC {
	designSystem: DesignSystem;
	allComponents: Record<string, ComponentDefinition>;
}

const AWC: AWC = {
	designSystem: DefaultDesignSystem,
	allComponents: AllComponents,
}

if (globalThis.AWC === void 0) {
	Reflect.defineProperty(globalThis, "AWC", {
		value: Object.create(AWC),
		configurable: false,
		enumerable: false,
		writable: false
	});
}

AWC.designSystem.adoptTokenStyles();
await AWC.designSystem.defineComponents(AWC.allComponents);