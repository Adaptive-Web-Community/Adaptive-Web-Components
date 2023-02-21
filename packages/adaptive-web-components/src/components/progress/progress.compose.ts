import { FASTProgress } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./progress.styles.js";
import { template } from "./progress.template.js";

/**
 * The Progress custom element definition. Implements {@link @microsoft/fast-foundation#FASTProgress}.
 *
 * @remarks
 * HTML Element: \<adaptive-progress\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTProgress.compose({
        name: `${ds.prefix}-progress`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
