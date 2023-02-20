import resolve from "@rollup/plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import svgo from 'rollup-plugin-svgo'
import { terser } from "rollup-plugin-terser";
import transformTaggedTemplate from "rollup-plugin-transform-tagged-template";
import {
    transformCSSFragment,
    transformHTMLFragment,
} from "../../build/transform-fragments.js";
import manifest from './package.json';

const parserOptions = {
	sourceType: "module"
};

const plugins = [
	resolve(),
	svgo({
		raw: true
	}),
	transformTaggedTemplate({
		tagsToProcess: ["css","css.partial"],
		transformer: transformCSSFragment,
		parserOptions
	}),
	transformTaggedTemplate({
		tagsToProcess: ["html"],
		transformer: transformHTMLFragment,
		parserOptions
	}),
	filesize({
		showMinifiedSize: true,
		showBrotliSize: true,
		showGzippedSize: true,
		showBeforeSizes: true
	}),
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
			{
				file: manifest.main,
				format: "cjs",
			}
		],
	}
]