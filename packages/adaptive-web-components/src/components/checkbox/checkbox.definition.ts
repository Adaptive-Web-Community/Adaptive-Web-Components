import { FASTCheckbox } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./checkbox.styles.js";
import { template } from "./checkbox.template.js";

/**
 * The Checkbox custom element definition. Implements {@link @microsoft/fast-foundation#FASTCheckbox}.
 *
 * @remarks
 * HTML Element: \<adaptive-checkbox\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTCheckbox.compose({
        name: `${ds.prefix}-checkbox`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
