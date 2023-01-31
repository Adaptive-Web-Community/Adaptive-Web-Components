import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTFlipper, flipperTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the accordion item expanded icon.
 */
export const FlipperNextKey: string = "flipper-next";

/**
 * Key for {@link DesignSystem} `statics` registration for the accordion item collapsed icon.
 */
export const FlipperPreviousKey: string = "flipper-previous";

/**
 * Default Flipper template, {@link @microsoft/fast-foundation#flipperTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTFlipper> =
    (ds: DesignSystem) =>
        flipperTemplate({
            next: ds.statics.get(FlipperPreviousKey),
            previous: ds.statics.get(FlipperNextKey),
        });
