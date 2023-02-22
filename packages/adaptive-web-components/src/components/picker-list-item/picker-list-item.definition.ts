import { DefaultDesignSystem } from "../../design-system.js";
import { composePickerListItem } from "./picker-list-item.compose.js";

/**
 * The Picker List Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerListItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-list-item\>
 *
 * @public
 */
export const pickerListItemDefinition = composePickerListItem(DefaultDesignSystem);