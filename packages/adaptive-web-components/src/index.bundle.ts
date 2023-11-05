import type { FASTElementDefinition } from '@microsoft/fast-element';
import { DesignToken } from '@microsoft/fast-foundation';
import { fillColor, layerFillFixedBase } from "@adaptive-web/adaptive-ui/reference";
import type { DesignSystem } from './design-system.js';
import { allComponents } from './custom-elements.js';
import { adaptiveDesignSystem } from './design-system.js';

declare global {
	// eslint-disable-next-line no-var
	var AWC: any;
}

interface AWC {
	designSystem: DesignSystem;
	allComponents: Record<string, FASTElementDefinition>;
}

const AWC: AWC = {
	designSystem: adaptiveDesignSystem,
	allComponents,
}

if (globalThis.AWC === void 0) {
	Reflect.defineProperty(globalThis, "AWC", {
		value: Object.create(AWC),
		configurable: false,
		enumerable: false,
		writable: false
	});
}

(() => {
	DesignToken.registerDefaultStyleTarget();
    fillColor.withDefault(layerFillFixedBase);
	AWC.designSystem.defineComponents(AWC.allComponents);
})();