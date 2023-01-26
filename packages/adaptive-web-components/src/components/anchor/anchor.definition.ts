import type { DesignSystem } from "../../design-system.js";
import { AdaptiveAnchor } from "./anchor.js";
import { styles } from "./anchor.styles.js";
import { template } from "./anchor.template.js";

/**
 * The Anchor custom element definition. Implements {@link AdaptiveAnchor}.
 *
 * @remarks
 * HTML Element: \<adaptive-anchor\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    AdaptiveAnchor.compose({
        name: `${ds.prefix}-anchor`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
