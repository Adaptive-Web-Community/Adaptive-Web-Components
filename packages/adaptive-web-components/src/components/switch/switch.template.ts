import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSwitch, switchTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Switch template, {@link @microsoft/fast-foundation#switchTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSwitch> =
    (ds: DesignSystem) =>
        switchTemplate({
            switch: `<div class="thumb" part="thumb"></div>`
        });
