import { ElementViewTemplate } from "@microsoft/fast-element";
import { cardTemplate, FASTCard } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const CardConditions = {
    interactive: "[interactive]",
};

/**
 * @public
 */
export const CardParts = {
};

/**
 * @public
 */
export const CardAnatomy: ComponentAnatomy<typeof CardConditions, typeof CardParts> = {
    interactivity: { 
        interactivitySelector: "[interactive]:not([disabled])",
        disabledSelector: "[interactive][disabled]",
    },
    conditions: CardConditions,
    parts: CardParts,
    focus: Focus.hostFocused(),
};

/**
 * Default Card template, {@link @microsoft/fast-foundation#cardTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCard> =
    (ds: DesignSystem) =>
        cardTemplate();
