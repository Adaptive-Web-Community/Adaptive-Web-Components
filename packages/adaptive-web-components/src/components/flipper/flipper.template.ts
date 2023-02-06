import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTFlipper, flipperTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the flipper next icon.
 */
export const FlipperNextKey: string = "flipper-next";

/**
 * Key for {@link DesignSystem} `statics` registration for the flipper previous icon.
 */
export const FlipperPreviousKey: string = "flipper-previous";

/**
 * Default Flipper template, {@link @microsoft/fast-foundation#flipperTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTFlipper> =
    (ds: DesignSystem) =>
        flipperTemplate({
            next: ds.statics.get(FlipperNextKey),
            previous: ds.statics.get(FlipperPreviousKey),
        });
