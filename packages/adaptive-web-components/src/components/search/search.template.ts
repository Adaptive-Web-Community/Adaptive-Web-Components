import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSearch, searchTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Search Field template, {@link @microsoft/fast-foundation#searchTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSearch> =
    (ds: DesignSystem) =>
        searchTemplate();
