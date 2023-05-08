import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTFlipper, flipperTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the flipper.
 *
 * @beta
 */
export const FlipperStatics = {
    next: "flipper-next",
    previous: "flipper-previous",
} as const;

/**
 * @beta
 */
export type FlipperStatics = ValuesOf<typeof FlipperStatics>;

/**
 * @public
 */
export const FlipperConditions = {
    next: "[direction='next']",
    previous: "[direction='previous']",
};

/**
 * @public
 */
export const FlipperParts = {
    next: "next",
    previous: "previous",
};

/**
 * @public
 */
export const FlipperAnatomy: ComponentAnatomy<typeof FlipperConditions, typeof FlipperParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: FlipperConditions,
    parts: FlipperParts,
};

/**
 * Default Flipper template, {@link @microsoft/fast-foundation#flipperTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTFlipper> =
    (ds: DesignSystem) =>
        flipperTemplate({
            previous: ds.statics.get(FlipperStatics.previous),
            next: ds.statics.get(FlipperStatics.next),
        });
