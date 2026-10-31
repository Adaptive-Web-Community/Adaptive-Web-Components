import { addons } from "storybook/manager-api";

addons.setConfig({
    // The shortcuts take the keys typed in a text field of a component, whose input is in its shadow root.
    enableShortcuts: false,
});
