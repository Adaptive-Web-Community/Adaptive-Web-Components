import { FASTBreadcrumb } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./breadcrumb.styles.js";
import { BreadcrumbAnatomy, template } from "./breadcrumb.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeBreadcrumb(
    ds: DesignSystem,
    options?: ComposeOptions<FASTBreadcrumb>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, BreadcrumbAnatomy.interactivity, options);

    return FASTBreadcrumb.compose({
        name: `${ds.prefix}-breadcrumb`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
