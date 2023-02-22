import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTFlipper, flipperTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the flipper.
 */
export const FlipperStatics = {
    previous: "flipper-previous",
    next: "flipper-next"
} as const;

export type FlipperStatics = ValuesOf<typeof FlipperStatics>;

/**
 * Default Flipper template, {@link @microsoft/fast-foundation#flipperTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTFlipper> =
    (ds: DesignSystem) =>
        flipperTemplate({
            previous: ds.statics.get(FlipperStatics.previous),
            next: ds.statics.get(FlipperStatics.next),
        });
