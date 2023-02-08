import { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    framework: "@storybook/html-vite",
    stories: [{ directory: "../src/" }],
};

export default config;
