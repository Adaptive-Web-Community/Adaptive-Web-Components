import { createRequire } from "node:module";
import { dirname } from "node:path";

const require = createRequire(import.meta.url);

// The framework and the addons are resolved from this package, as Storybook recommends in a monorepo: Storybook itself may be hoisted
// to the root, where it doesn't find a framework that is installed here.
const resolvePackage = name => dirname(require.resolve(`${name}/package.json`));

/** @type {import("@storybook/html-vite").StorybookConfig} */
export default {
    addons: [resolvePackage("@storybook/addon-docs")],
    stories: ["../src/**/*.stories.ts"],
    framework: resolvePackage("@storybook/html-vite"),
    core: {
        disableTelemetry: true,
    },
};
