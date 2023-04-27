import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSwitch, switchTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const SwitchConditions = {
    checked: "[aria-checked='true']",
};

export const SwitchParts = {
    switch: "switch",
    label: "label",
    thumb: "thumb",
};

export const SwitchAnatomy: ComponentAnatomy<typeof SwitchConditions, typeof SwitchParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: SwitchConditions,
    parts: SwitchParts,
};

/**
 * Default Switch template, {@link @microsoft/fast-foundation#switchTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSwitch> =
    (ds: DesignSystem) =>
        switchTemplate({
            switch: `<div class="thumb" part="thumb"></div>`
        });
