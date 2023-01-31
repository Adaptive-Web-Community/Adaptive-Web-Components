import { ElementViewTemplate } from "@microsoft/fast-element";
import { disclosureTemplate, FASTDisclosure } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Disclosure template, {@link @microsoft/fast-foundation#disclosureTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDisclosure> =
    (ds: DesignSystem) =>
        disclosureTemplate();
