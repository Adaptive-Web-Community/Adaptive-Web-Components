import { DesignToken } from '@microsoft/fast-foundation';
import { AllComponents } from './custom-elements.js';
import { DefaultDesignSystem } from './design-system.js';

(() => {
	DesignToken.registerDefaultStyleTarget();
	DefaultDesignSystem.defineComponents(AllComponents);
})();