import { FASTDisclosure } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./disclosure.styles.js";
import { template } from "./disclosure.template.js";

/**
 * The Disclosure custom element definition. Implements {@link @microsoft/fast-foundation#FASTDisclosure}.
 *
 * @remarks
 * HTML Element: \<adaptive-disclosure\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTDisclosure.compose({
        name: `${ds.prefix}-disclosure`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
