export {
	type ComponentDefinition,
	type ComponentStatics,
	type ComposeOptions,
	DesignSystem,
	DefaultDesignSystem as AdaptiveDesignSystem,
	type ElementStaticMap,
	type PartialDesignSystem,
} from "./design-system.js";
export * from "./components/index.js";
export * from "./styles/index.js";
export { BaseFormControl } from "./utilities/base-form-control.js";
export { type StaticallyComposableHTML, staticallyCompose } from "./utilities/template-helpers.js";
