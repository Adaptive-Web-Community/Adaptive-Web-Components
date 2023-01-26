import type { DesignSystem } from "../../design-system.js";
import { AdaptiveButton } from "./button.js";
import { styles } from "./button.styles.js";
import { template } from "./button.template.js";

/**
 * The Button custom element definition. Implements {@link AdaptiveButton}.
 *
 * @remarks
 * HTML Element: \<adaptive-button\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    AdaptiveButton.compose({
        name: `${ds.prefix}-button`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
