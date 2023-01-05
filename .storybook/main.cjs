const ResolveTypescriptPlugin = require("resolve-typescript-plugin");
const path = require("path");

module.exports = {
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.ts"],
    framework: "@storybook/web-components",
    features: {
        babelModeV7: true,
    },
    core: {
        disableTelemetry: true,
        builder: {
            name: "webpack5",
            options: {
                lazyCompilation: true,
                fsCache: true,
            },
        },
    },
    webpackFinal: async config => {
        config.performance = {
            ...(config.performance ?? {}),
            hints: false,
        };
        config.module.rules = [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                sideEffects: true,
                options: {
                    configFile: path.resolve("./tsconfig.json"),
                    transpileOnly: true,
                },
            },
            {
                test: /\.m?js$/,
                enforce: "pre",
                loader: require.resolve("source-map-loader"),
                resolve: {
                    fullySpecified: false,
                },
            },
        ];

        config.resolve.plugins = [
            ...(config.resolve.plugins ?? []),
            new ResolveTypescriptPlugin({
                includeNodeModules: true,
            }),
        ];
        return config;
    },
};
