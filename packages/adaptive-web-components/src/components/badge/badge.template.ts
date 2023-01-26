import { ElementViewTemplate } from "@microsoft/fast-element";
import { badgeTemplate, FASTBadge } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Badge template, {@link @microsoft/fast-foundation#badgeTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBadge> =
    (ds: DesignSystem) =>
        badgeTemplate();
