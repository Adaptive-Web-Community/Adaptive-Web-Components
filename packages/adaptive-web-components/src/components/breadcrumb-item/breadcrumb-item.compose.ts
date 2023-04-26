import { FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./breadcrumb-item.styles.js";
import { BreadcrumbItemAnatomy, BreadcrumbItemStatics, template } from "./breadcrumb-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeBreadcrumbItem(
    ds: DesignSystem,
    options?: ComposeOptions<FASTBreadcrumbItem, BreadcrumbItemStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(BreadcrumbItemStatics.separator)) {
            ds.statics.set(
                BreadcrumbItemStatics.separator,
                options.statics[BreadcrumbItemStatics.separator]
            );
        }
    }

    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, BreadcrumbItemAnatomy.interactivity, options);

    return FASTBreadcrumbItem.compose({
        name: `${ds.prefix}-breadcrumb-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    })
}
