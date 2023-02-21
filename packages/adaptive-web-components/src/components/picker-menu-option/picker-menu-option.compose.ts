import { FASTPickerMenuOption } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./picker-menu-option.styles.js";
import { template } from "./picker-menu-option.template.js";

/**
 * The Picker Menu Option custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerMenuOption}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-menu-option\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTPickerMenuOption.compose({
        name: `${ds.prefix}-picker-menu-option`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
