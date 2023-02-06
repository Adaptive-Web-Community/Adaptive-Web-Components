import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTPicker, pickerTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";
import { AnchoredRegionDefinition } from "../anchored-region/index.js";
import { PickerListDefinition } from "../picker-list/index.js";
import { PickerListItemDefinition } from "../picker-list-item/index.js";
import { PickerMenuDefinition } from "../picker-menu/index.js";
import { PickerMenuOptionDefinition } from "../picker-menu-option/index.js";
import { ProgressRingDefinition } from "../progress-ring/index.js";

/**
 * Default Picker template, {@link @microsoft/fast-foundation#pickerTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTPicker> =
    (ds: DesignSystem) =>
        pickerTemplate({
            anchoredRegion: AnchoredRegionDefinition(ds),
            pickerList: PickerListDefinition(ds),
            pickerListItem: PickerListItemDefinition(ds),
            pickerMenu:  PickerMenuDefinition(ds),
            pickerMenuOption: PickerMenuOptionDefinition(ds),
            progressRing: ProgressRingDefinition(ds),
        });
