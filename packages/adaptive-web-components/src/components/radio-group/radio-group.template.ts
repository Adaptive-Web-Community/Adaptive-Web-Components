import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTRadioGroup, radioGroupTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const RadioGroupConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
};

/**
 * @public
 */
export const RadioGroupParts = {
    positioningRegion: "positioning-region",
};

/**
 * @public
 */
export const RadioGroupAnatomy: ComponentAnatomy<typeof RadioGroupConditions, typeof RadioGroupParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: RadioGroupConditions,
    parts: RadioGroupParts,
};

/**
 * Default Radio Group template, {@link @microsoft/fast-foundation#radioGroupTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTRadioGroup> =
    (ds: DesignSystem) =>
        radioGroupTemplate();
