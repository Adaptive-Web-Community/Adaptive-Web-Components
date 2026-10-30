import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import fastTaggedTemplates from "rollup-plugin-fast-tagged-templates";
import { transformHTMLFragment } from "../../build/transform-fragments.js";
import manifest from "./package.json" with { type: "json" };

// The bundle for a CDN: a module that defines every component, with its dependencies.
export default {
	input: "dist/esm/index.bundle.js",
	plugins: [
		resolve(),
		fastTaggedTemplates({ html: transformHTMLFragment, css: true }),
	],
	output: {
		file: manifest.unpkg,
		format: "esm",
		plugins: [terser()],
	},
};
