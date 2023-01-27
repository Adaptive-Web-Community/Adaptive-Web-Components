import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTRadio, radioTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the radio checked indicator.
 */
export const RadioCheckedIndicatorKey: string = "radio-checked-indicator";

/**
 * Default Radio template, {@link @microsoft/fast-foundation#radioTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTRadio> =
    (ds: DesignSystem) =>
        radioTemplate({
            checkedIndicator: ds.statics.get(RadioCheckedIndicatorKey),
        });
