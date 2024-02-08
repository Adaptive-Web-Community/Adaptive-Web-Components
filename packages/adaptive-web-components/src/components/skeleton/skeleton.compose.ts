import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./skeleton.styles.js";
import { SkeletonAnatomy, template } from "./skeleton.template.js";
import { Skeleton } from "./skeleton.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSkeleton(
    ds: DesignSystem,
    options?: ComposeOptions<Skeleton>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, SkeletonAnatomy, options);

    return Skeleton.compose({
        name: `${ds.prefix}-skeleton`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
