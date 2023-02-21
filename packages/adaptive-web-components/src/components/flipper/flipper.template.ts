import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTFlipper, flipperTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the flipper next and previous icons.
 */
export const FlipperIconKeys = {
    previous: "flipper-previous",
    next: "flipper-next"
} as const;

export type FlipperIconKeys = ValuesOf<typeof FlipperIconKeys>;

/**
 * Default Flipper template, {@link @microsoft/fast-foundation#flipperTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTFlipper> =
    (ds: DesignSystem) =>
        flipperTemplate({
            previous: ds.statics.get(FlipperIconKeys.previous),
            next: ds.statics.get(FlipperIconKeys.next),
        });
