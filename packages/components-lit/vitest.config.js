import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const configDir = fileURLToPath(new URL("./.storybook", import.meta.url));

const browser = {
    enabled: true,
    headless: true,
    provider: playwright(),
    instances: [{ browser: "chromium" }],
};

export default defineConfig({
    test: {
        projects: [
            {
                extends: true,
                plugins: [storybookTest({ configDir })],
                test: {
                    name: "storybook",
                    browser,
                    setupFiles: ["./.storybook/vitest.setup.js"],
                },
            },
            {
                extends: true,
                test: {
                    name: "conformance",
                    include: ["src/**/*.spec.ts"],
                    browser,
                    setupFiles: ["./vitest.setup.js"],
                },
            },
        ],
    },
});
