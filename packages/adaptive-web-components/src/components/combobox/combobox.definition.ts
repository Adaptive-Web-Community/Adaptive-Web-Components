import { FASTCombobox } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./combobox.styles.js";
import { template } from "./combobox.template.js";

/**
 * The Combobox custom element definition. Implements {@link @microsoft/fast-foundation#FASTCombobox}.
 *
 * @remarks
 * HTML Element: \<adaptive-combobox\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTCombobox.compose({
        name: `${ds.prefix}-combobox`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
