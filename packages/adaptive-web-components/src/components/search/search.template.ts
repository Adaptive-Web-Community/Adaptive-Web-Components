import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTSearch, searchTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const SearchConditions = {
};

/**
 * @public
 */
export const SearchParts = {
    label: "label",
    root: "root",
    control: "control",
    clearButton: "clear-button",
};

/**
 * @public
 */
export const SearchAnatomy: ComponentAnatomy<typeof SearchConditions, typeof SearchParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: SearchConditions,
    parts: SearchParts,
    focus: Focus.partWithin("root", "control"),
};

/**
 * Default Search Field template, {@link @microsoft/fast-foundation#searchTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSearch> =
    (ds: DesignSystem) =>
        searchTemplate();
