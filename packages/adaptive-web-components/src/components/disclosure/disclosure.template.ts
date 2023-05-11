import { ElementViewTemplate } from "@microsoft/fast-element";
import { disclosureTemplate, FASTDisclosure } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const DisclosureConditions = {
    expanded: "[expanded]",
};

/**
 * @public
 */
export const DisclosureParts = {
    invoker: "invoker",
};

/**
 * @public
 */
export const DisclosureAnatomy: ComponentAnatomy<typeof DisclosureConditions, typeof DisclosureParts> = {
    interactivity: Interactivity.never,
    conditions: DisclosureConditions,
    parts: DisclosureParts,
};

/**
 * Default Disclosure template, {@link @microsoft/fast-foundation#disclosureTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDisclosure> =
    (ds: DesignSystem) =>
        disclosureTemplate();
