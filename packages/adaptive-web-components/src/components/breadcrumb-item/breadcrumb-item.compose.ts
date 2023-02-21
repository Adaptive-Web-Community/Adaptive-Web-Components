import { FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./breadcrumb-item.styles.js";
import { BreadcrumbItemIconKeys, template } from "./breadcrumb-item.template.js";

export function composeBreadcrumbItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTBreadcrumbItem, BreadcrumbItemIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(BreadcrumbItemIconKeys.separator)) {
            ds.statics.set(
                BreadcrumbItemIconKeys.separator,
                options.statics[BreadcrumbItemIconKeys.separator]
            );
        }
    }

    return FASTBreadcrumbItem.compose({
        name: `${ds.prefix}-breadcrumb-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    })
}