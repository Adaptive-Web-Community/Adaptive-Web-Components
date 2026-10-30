import { composedTagNames } from "./cem.plugins.mjs";

export default {
	globs: [
		"src/components/**/*.ts",
		"src/utilities/**/*.ts"
	],
	exclude: [
		"src/*.ts",
		"src/**/*.md",
		"src/**/index.ts",
		"src/**/*.stories.*",
		"src/utilities/storybook-helpers.ts"
	],
	outdir: "dist",
	dev: false,
	fast: true,
	plugins: [composedTagNames()]
};
