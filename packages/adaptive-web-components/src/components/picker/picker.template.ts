import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPicker, pickerTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { composeAnchoredRegion } from "../anchored-region/index.js";
import { composePickerList } from "../picker-list/index.js";
import { composePickerMenu } from '../picker-menu/index.js';
import { composePickerListItem } from '../picker-list-item/index.js';
import { composePickerMenuOption } from '../picker-menu-option/index.js';
import { composeProgressRing } from '../progress-ring/index.js';

/**
 * @public
 */
export const PickerConditions = {
};

/**
 * @public
 */
export const PickerParts = {
    region: "region",
    noOptionsDisplay: "no-options-display",
    loadingDisplay: "loading-display",
    loadingProgress: "loading-progress",
};

/**
 * @public
 */
export const PickerAnatomy: ComponentAnatomy<typeof PickerConditions, typeof PickerParts> = {
    interactivity: Interactivity.never,
    conditions: PickerConditions,
    parts: PickerParts,
};

/**
 * Default Picker template, {@link @microsoft/fast-foundation#pickerTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPicker> =
    (ds: DesignSystem) =>
        pickerTemplate({
            anchoredRegion: composeAnchoredRegion(ds),
            pickerList: composePickerList(ds),
            pickerListItem: composePickerListItem(ds),
            pickerMenu:  composePickerMenu(ds),
            pickerMenuOption: composePickerMenuOption(ds),
            progressRing: composeProgressRing(ds),
        });
