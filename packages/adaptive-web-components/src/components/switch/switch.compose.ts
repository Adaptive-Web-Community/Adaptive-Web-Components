import { FASTSwitch } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./switch.styles.js";
import { template } from "./switch.template.js";

/**
 * The Switch custom element definition. Implements {@link @microsoft/fast-foundation#FASTSwitch}.
 *
 * @remarks
 * HTML Element: \<adaptive-switch\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTSwitch.compose({
        name: `${ds.prefix}-switch`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
