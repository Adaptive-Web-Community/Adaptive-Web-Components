import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTooltip, tooltipTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Tooltip template, {@link @microsoft/fast-foundation#tooltipTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTooltip> =
    (ds: DesignSystem) =>
        tooltipTemplate();
