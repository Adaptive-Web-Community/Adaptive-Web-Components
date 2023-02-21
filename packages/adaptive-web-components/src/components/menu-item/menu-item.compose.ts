import type { DesignSystem } from "../../design-system.js";
import { AdaptiveMenuItem } from "./menu-item.js";
import { styles } from "./menu-item.styles.js";
import { template } from "./menu-item.template.js";

/**
 * The Menu Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTMenuItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-menu-item\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    AdaptiveMenuItem.compose({
        name: `${ds.prefix}-menu-item`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
