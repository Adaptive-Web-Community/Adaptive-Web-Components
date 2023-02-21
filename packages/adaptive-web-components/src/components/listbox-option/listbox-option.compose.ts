import { FASTListboxOption } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./listbox-option.styles.js";
import { template } from "./listbox-option.template.js";

/**
 * The option custom element definition. Implements {@link @microsoft/fast-foundation#FASTListboxOption}.
 *
 * @remarks
 * HTML Element: \<adaptive-option\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTListboxOption.compose({
        name: `${ds.prefix}-option`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
