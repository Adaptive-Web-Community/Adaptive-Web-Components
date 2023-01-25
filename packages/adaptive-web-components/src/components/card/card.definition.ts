import { FASTCard } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./card.styles.js";
import { template } from "./card.template.js";

/**
 * The Card custom element definition. Implements {@link @microsoft/fast-foundation#FASTCard}.
 *
 * @remarks
 * HTML Element: \<adaptive-card\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTCard.compose({
        name: `${ds.prefix}-card`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
