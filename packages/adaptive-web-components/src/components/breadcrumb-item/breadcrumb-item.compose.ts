import { FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from "../../styles/styles.js";
import { AdaptiveBreadcrumbItem } from "./breadcrumb-item.js";
import { aestheticStyles, templateStyles } from "./breadcrumb-item.styles.js";
import { BreadcrumbItemAnatomy, BreadcrumbItemStatics, template } from "./breadcrumb-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
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

    const styles = DesignSystem.assembleStyles(defaultStyles, BreadcrumbItemAnatomy, options);

    return AdaptiveBreadcrumbItem.compose({
        name: `${ds.prefix}-breadcrumb-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    })
}
