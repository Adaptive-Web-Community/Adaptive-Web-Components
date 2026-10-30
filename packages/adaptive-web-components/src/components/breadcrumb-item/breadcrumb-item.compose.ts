import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from "../../styles/styles.js";
import { BreadcrumbItem } from "./breadcrumb-item.js";
import { aestheticStyles, templateStyles } from "./breadcrumb-item.styles.js";
import { BreadcrumbItemAnatomy, BreadcrumbItemStatics, template } from "./breadcrumb-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeBreadcrumbItem(
    ds: DesignSystem,
    options?: ComposeOptions<BreadcrumbItem, BreadcrumbItemStatics>
): Promise<FASTElementDefinition<typeof BreadcrumbItem>> {
    if (options?.statics) {
        if (!ds.statics.has(BreadcrumbItemStatics.separator)) {
            ds.statics.set(
                BreadcrumbItemStatics.separator,
                options.statics[BreadcrumbItemStatics.separator]
            );
        }
    }

    const styles = ds.assembleStyles(defaultStyles, BreadcrumbItemAnatomy, options);

    return FASTElementDefinition.compose(BreadcrumbItem, {
        name: `${ds.prefix}-breadcrumb-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    })
}
