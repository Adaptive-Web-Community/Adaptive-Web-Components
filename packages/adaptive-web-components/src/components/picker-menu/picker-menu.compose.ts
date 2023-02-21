import { FASTPickerMenu } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./picker-menu.styles.js";
import { template } from "./picker-menu.template.js";

/**
 * The Picker Menu custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerMenu}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-menu\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTPickerMenu.compose({
        name: `${ds.prefix}-picker-menu`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
