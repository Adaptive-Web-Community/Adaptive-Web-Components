import type { DesignSystem } from "../../design-system.js";
import { AdaptiveMenu } from "./menu.js";
import { styles } from "./menu.styles.js";
import { template } from "./menu.template.js";

/**
 * The Menu custom element definition. Implements {@link @microsoft/fast-foundation#FASTMenu}.
 *
 * @remarks
 * HTML Element: \<adaptive-menu\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    AdaptiveMenu.compose({
        name: `${ds.prefix}-menu`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
