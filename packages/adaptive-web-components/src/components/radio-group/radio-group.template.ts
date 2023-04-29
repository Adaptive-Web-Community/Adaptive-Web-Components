import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTRadioGroup, radioGroupTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const RadioGroupConditions = {
    horizontal: "[orientation='horizontal']",
    vertical: "[orientation='vertical']",
};

export const RadioGroupParts = {
    positioningRegion: "positioning-region",
};

export const RadioGroupAnatomy: ComponentAnatomy<typeof RadioGroupConditions, typeof RadioGroupParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: RadioGroupConditions,
    parts: RadioGroupParts,
};

/**
 * Default Radio Group template, {@link @microsoft/fast-foundation#radioGroupTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTRadioGroup> =
    (ds: DesignSystem) =>
        radioGroupTemplate();
