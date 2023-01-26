import { FASTTextField } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./text-field.styles.js";
import { template } from "./text-field.template.js";

/**
 * The Text Field custom element definition. Implements {@link @microsoft/fast-foundation#FASTTextField}.
 *
 * @remarks
 * HTML Element: \<adaptive-text-field\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTextField.compose({
        name: `${ds.prefix}-text-field`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
