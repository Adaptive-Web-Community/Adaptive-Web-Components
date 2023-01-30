import { ElementViewTemplate } from "@microsoft/fast-element";
import { accordionTemplate, FASTAccordion } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Accordion template, {@link @microsoft/fast-foundation#accordionTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAccordion> =
    (ds: DesignSystem) =>
        accordionTemplate();
