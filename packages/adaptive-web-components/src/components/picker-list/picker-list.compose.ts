import { FASTPickerList } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./picker-list.styles.js";
import { template } from "./picker-list.template.js";

/**
 * The Picker List custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerList}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-list\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTPickerList.compose({
        name: `${ds.prefix}-picker-list`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
