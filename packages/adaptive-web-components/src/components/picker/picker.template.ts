import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPicker, pickerTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";
import { composeAnchoredRegion } from "../anchored-region/index.js";
import { composePickerList } from "../picker-list/index.js";
import { composePickerMenu } from '../picker-menu/index.js';
import { composePickerListItem } from '../picker-list-item/index.js';
import { composePickerMenuOption } from '../picker-menu-option/index.js';
import { composeProgressRing } from '../progress-ring/index.js';

/**
 * Default Picker template, {@link @microsoft/fast-foundation#pickerTemplate}.
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
