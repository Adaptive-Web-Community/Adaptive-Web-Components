import { FASTProgressRing } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./progress-ring.styles.js";
import { template } from "./progress-ring.template.js";

/**
 * The Progress Ring custom element definition. Implements {@link @microsoft/fast-foundation#FASTProgressRing}.
 *
 * @remarks
 * HTML Element: \<adaptive-progress-ring\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTProgressRing.compose({
        name: `${ds.prefix}-progress-ring`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
