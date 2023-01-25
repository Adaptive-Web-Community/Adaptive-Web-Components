import { ElementViewTemplate } from "@microsoft/fast-element";
import { cardTemplate, FASTCard } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Card template, {@link @microsoft/fast-foundation#cardTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCard> =
    (ds: DesignSystem) =>
        cardTemplate();
