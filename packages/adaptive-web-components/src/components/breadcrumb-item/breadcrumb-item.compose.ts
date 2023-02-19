import { FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./breadcrumb-item.styles.js";
import { template } from "./breadcrumb-item.template.js";

export const composeBreadcrumbItem = (ds: DesignSystem) =>
    FASTBreadcrumbItem.compose({
        name: `${ds.prefix}-breadcrumb-item`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
