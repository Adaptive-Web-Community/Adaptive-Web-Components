import { ElementViewTemplate } from "@microsoft/fast-element";
import { cardTemplate, FASTCard } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const CardConditions = {
};

export const CardParts = {
};

export const CardAnatomy: ComponentAnatomy<typeof CardConditions, typeof CardParts> = {
    interactivity: Interactivity.never,
    conditions: CardConditions,
    parts: CardParts,
};

/**
 * Default Card template, {@link @microsoft/fast-foundation#cardTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCard> =
    (ds: DesignSystem) =>
        cardTemplate();
