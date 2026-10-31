import * as a11yAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/html-vite";
import * as projectAnnotations from "./preview.js";

setProjectAnnotations([a11yAnnotations, projectAnnotations]);
