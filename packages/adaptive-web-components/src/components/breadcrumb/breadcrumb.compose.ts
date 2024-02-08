import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./breadcrumb.styles.js";
import { BreadcrumbAnatomy, template } from "./breadcrumb.template.js";
import { Breadcrumb } from "./breadcrumb.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeBreadcrumb(
    ds: DesignSystem,
    options?: ComposeOptions<Breadcrumb>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, BreadcrumbAnatomy, options);

    return Breadcrumb.compose({
        name: `${ds.prefix}-breadcrumb`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
