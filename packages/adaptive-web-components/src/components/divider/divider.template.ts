import { ElementViewTemplate } from "@microsoft/fast-element";
import { dividerTemplate, FASTDivider } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Divider template, {@link @microsoft/fast-foundation#dividerTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDivider> =
    (ds: DesignSystem) =>
        dividerTemplate();
