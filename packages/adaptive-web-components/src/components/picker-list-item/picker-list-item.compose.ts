import { FASTPickerListItem } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./picker-list-item.styles.js";
import { template } from "./picker-list-item.template.js";

/**
 * The Picker List Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerListItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-list-item\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTPickerListItem.compose({
        name: `${ds.prefix}-picker-list-item`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
