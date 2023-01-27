import { FASTRadio } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./radio.styles.js";
import { template } from "./radio.template.js";

/**
 * The Radio custom element definition. Implements {@link @microsoft/fast-foundation#FASTRadio}.
 *
 * @remarks
 * HTML Element: \<adaptive-radio\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTRadio.compose({
        name: `${ds.prefix}-radio`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
