import { FASTFlipper } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./flipper.styles.js";
import { template } from "./flipper.template.js";

/**
 * The Flipper custom element definition. Implements {@link @microsoft/fast-foundation#FASTFlipper}.
 *
 * @remarks
 * HTML Element: \<adaptive-flipper\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTFlipper.compose({
        name: `${ds.prefix}-flipper`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
