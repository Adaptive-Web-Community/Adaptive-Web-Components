import { FASTListboxElement } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./listbox.styles.js";
import { template } from "./listbox.template.js";

/**
 * The Listbox custom element definition. Implements {@link @microsoft/fast-foundation#FASTListboxElement}.
 *
 * @remarks
 * HTML Element: \<adaptive-listbox\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTListboxElement.compose({
        name: `${ds.prefix}-listbox`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
