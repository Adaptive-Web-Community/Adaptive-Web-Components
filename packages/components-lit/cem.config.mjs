// The members of a class that aren't the API of its elements, which Storybook would otherwise show as controls: the private and the
// static ones.
const elementMembers = {
	name: "element-members",
	packageLinkPhase({ customElementsManifest }) {
		for (const module of customElementsManifest.modules) {
			for (const declaration of module.declarations ?? []) {
				if (declaration.kind === "class" && declaration.members) {
					declaration.members = declaration.members.filter(member => member.privacy !== "private" && !member.static);
				}
			}
		}
	},
};

// The tag name of an element is the one of the default design system, from the `@tagname` of its class: the analyzer can't read the name
// that `compose<Name>` makes from the prefix of a design system.
export default {
	globs: ["src/components/**/*.ts"],
	exclude: ["src/**/index.ts", "src/**/*.stories.ts", "src/**/*.spec.ts"],
	outdir: "dist",
	dev: false,
	litelement: true,
	plugins: [elementMembers],
};
