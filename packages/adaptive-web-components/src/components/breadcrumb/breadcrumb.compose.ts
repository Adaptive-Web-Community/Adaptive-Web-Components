import { FASTBreadcrumb } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./breadcrumb.styles.js";
import { template } from "./breadcrumb.template.js";

export const composeBreadcrumb = (ds: DesignSystem) =>
    FASTBreadcrumb.compose({
        name: `${ds.prefix}-breadcrumb`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
