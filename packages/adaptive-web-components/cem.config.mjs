export default {
	globs: [
		"src/components/**/*.ts"
	],
	exclude: [
		"src/*.ts",
		"src/**/*.md",
		"src/**/index.ts",
		"src/**/*.stories.*"
	],
	outdir: "dist",
	dev: false,
	fast: true
};