import { FASTSkeleton } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./skeleton.styles.js";
import { template } from "./skeleton.template.js";

export function composeSkeleton(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSkeleton>
): FASTElementDefinition {
    return FASTSkeleton.compose({
        name: `${ds.prefix}-skeleton`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}