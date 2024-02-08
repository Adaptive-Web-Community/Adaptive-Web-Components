import { fastElementPlugin } from "./cem.plugins.mjs";

export default {
    globs: [
        "src/components/**/*.ts"
    ],
    exclude: [
        "src/*.ts",
        "src/**/*.md",
        "src/**/index.ts",
        "src/**/*.stories.*",
        "src/**/*.styles.*"
    ],
    outdir: "dist",
    dev: false,
    dependencies: true,
    fast: true,
    plugins: [
        fastElementPlugin()
    ]
};
