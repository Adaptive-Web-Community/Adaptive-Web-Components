import { FASTSkeleton } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./skeleton.styles.js";
import { SkeletonAnatomy, template } from "./skeleton.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSkeleton(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSkeleton>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, SkeletonAnatomy, options);

    return FASTSkeleton.compose({
        name: `${ds.prefix}-skeleton`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
