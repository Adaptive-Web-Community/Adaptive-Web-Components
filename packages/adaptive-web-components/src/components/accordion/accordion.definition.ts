import { FASTAccordion } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./accordion.styles.js";
import { template } from "./accordion.template.js";

/**
 * The Accordion custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordion}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTAccordion.compose({
        name: `${ds.prefix}-accordion`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
