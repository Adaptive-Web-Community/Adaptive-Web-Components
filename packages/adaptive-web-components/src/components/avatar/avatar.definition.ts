import { FASTAvatar } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./avatar.styles.js";
import { template } from "./avatar.template.js";

/**
 * The Avatar custom element definition. Implements {@link @microsoft/fast-foundation#FASTAvatar}.
 *
 * @remarks
 * HTML Element: \<adaptive-avatar\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTAvatar.compose({
        name: `${ds.prefix}-avatar`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
