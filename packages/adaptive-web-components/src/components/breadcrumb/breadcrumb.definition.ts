import { FASTBreadcrumb } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./breadcrumb.styles.js";
import { template } from "./breadcrumb.template.js";

/**
 * The Breadcrumb custom element definition. Implements {@link @microsoft/fast-foundation#FASTBreadcrumb}.
 *
 * @remarks
 * HTML Element: \<adaptive-breadcrumb\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTBreadcrumb.compose({
        name: `${ds.prefix}-breadcrumb`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
