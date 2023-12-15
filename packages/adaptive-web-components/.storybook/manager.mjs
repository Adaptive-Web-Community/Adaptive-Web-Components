import { addons } from "@storybook/addons";

addons.setConfig({
    // Revisit in Storybook 7.x, but right now it causes issues with text input fields.
    enableShortcuts: false,
});
