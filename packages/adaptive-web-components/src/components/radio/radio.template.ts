import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTRadio, radioTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the radio.
 *
 * @beta
 */
export const RadioStatics = {
    checked: "radio-checked-indicator"
} as const;

/**
 * @beta
 */
export type RadioStatics = ValuesOf<typeof RadioStatics>;

/**
 * @public
 */
export const RadioConditions = {
    checked: "[aria-checked='true']",
};

/**
 * @public
 */
export const RadioParts = {
    control: "control",
    label: "label",
};

/**
 * @public
 */
export const RadioAnatomy: ComponentAnatomy<typeof RadioConditions, typeof RadioParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: RadioConditions,
    parts: RadioParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Radio template, {@link @microsoft/fast-foundation#radioTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTRadio> =
    (ds: DesignSystem) =>
        radioTemplate({
            checkedIndicator: ds.statics.get(RadioStatics.checked),
        });
