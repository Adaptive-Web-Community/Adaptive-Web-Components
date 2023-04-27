import { ElementViewTemplate } from "@microsoft/fast-element";
import { disclosureTemplate, FASTDisclosure } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const DisclosureConditions = {
    expanded: "[expanded]",
};

export const DisclosureParts = {
    invoker: "invoker",
};

export const DisclosureAnatomy: ComponentAnatomy<typeof DisclosureConditions, typeof DisclosureParts> = {
    interactivity: Interactivity.never,
    conditions: DisclosureConditions,
    parts: DisclosureParts,
};

/**
 * Default Disclosure template, {@link @microsoft/fast-foundation#disclosureTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDisclosure> =
    (ds: DesignSystem) =>
        disclosureTemplate();
