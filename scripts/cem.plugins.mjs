import * as foundation from "@adaptive-web/components-foundation";

/**
 * Names each element as its `compose<Name>` names it with a design system of the given prefix, for the custom elements manifest of a
 * package of components.
 *
 * @remarks
 * The analyzer can't read the name, which `compose<Name>` makes from the prefix of the design system. The manifest has the names of the
 * default design system. The name after the prefix is the `name` of the composition of the foundation that the component is composed
 * from (`ds.compose(Button, buttonComposition, …)`), read from the built foundation, or, for a FAST component that isn't composed from one
 * yet, the end of the `name` of its definition (`FASTElementDefinition.compose(Checkbox, { name: `${ds.prefix}-checkbox` })`).
 * A class that is composed is a custom element, which the analyzer finds only of a class that extends an element directly, not of one
 * that extends a base of the package (`Checkbox`, of `BaseCheckable`).
 *
 * @param {string} prefix - The prefix of the design system, `adaptive` by default.
 * @returns {import("@custom-elements-manifest/analyzer").Plugin}
 */
export function composedTagNames(prefix = "adaptive") {
	const tagNames = new Map();
	return {
		name: "composed-tag-names",
		analyzePhase({ ts, node }) {
			if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression) || node.expression.name.text !== "compose") {
				return;
			}
			const [type, definition] = node.arguments;
			if (!type || !ts.isIdentifier(type) || !definition) {
				return;
			}
			if (ts.isIdentifier(definition)) {
				const name = foundation[definition.text]?.name;
				if (typeof name === "string") {
					tagNames.set(type.text, `${prefix}-${name}`);
				}
				return;
			}
			if (!ts.isObjectLiteralExpression(definition)) {
				return;
			}
			const name = definition.properties.find(
				property => ts.isPropertyAssignment(property) && ts.isIdentifier(property.name) && property.name.text === "name"
			);
			// `${ds.prefix}-button`: no text before the prefix, and the rest of the name after it.
			const template = name?.initializer;
			if (template && ts.isTemplateExpression(template) && template.head.text === "" && template.templateSpans.length === 1) {
				tagNames.set(type.text, `${prefix}${template.templateSpans[0].literal.text}`);
			}
		},
		packageLinkPhase({ customElementsManifest }) {
			for (const module of customElementsManifest.modules) {
				for (const declaration of module.declarations ?? []) {
					if (declaration.kind === "class" && tagNames.has(declaration.name)) {
						declaration.customElement = true;
						declaration.tagName = tagNames.get(declaration.name);
					}
				}
			}
		},
	};
}
