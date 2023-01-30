import { FASTNumberField } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./number-field.styles.js";
import { template } from "./number-field.template.js";

/**
 * The Number Field custom element definition. Implements {@link @microsoft/fast-foundation#FASTNumberField}.
 *
 * @remarks
 * HTML Element: \<adaptive-number-field\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTNumberField.compose({
        name: `${ds.prefix}-number-field`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
