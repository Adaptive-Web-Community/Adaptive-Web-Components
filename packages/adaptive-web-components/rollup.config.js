import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import fastTaggedTemplates from "rollup-plugin-fast-tagged-templates";
import { transformHTMLFragment } from "../../build/transform-fragments.js";
import manifest from "./package.json" with { type: "json" };

const plugins = [
	resolve(),
	fastTaggedTemplates({ html: transformHTMLFragment, css: true }),
]

export default [
	{
		plugins,
		input: "dist/esm/index.bundle.js",
		output: [
			{
				file: manifest.unpkg,
				format: "esm",
				plugins: [terser()]
			},
		],
	},
	{
		plugins,
		input: "dist/esm/index.js",
		output: [
			{
				file: manifest.main,
				format: "cjs",
				plugins: [terser()]
			}
		]
	}
]
