import { FASTBreadcrumb } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./breadcrumb.styles.js";
import { template } from "./breadcrumb.template.js";

export function composeBreadcrumb(
    ds: DesignSystem,
    options?: ComposeOptions<FASTBreadcrumb>
): FASTElementDefinition {
    return FASTBreadcrumb.compose({
        name: `${ds.prefix}-breadcrumb`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}