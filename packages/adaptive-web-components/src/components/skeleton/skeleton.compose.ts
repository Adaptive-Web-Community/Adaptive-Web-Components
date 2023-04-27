import { FASTSkeleton } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./skeleton.styles.js";
import { SkeletonAnatomy, template } from "./skeleton.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeSkeleton(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSkeleton>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, SkeletonAnatomy.interactivity, options);

    return FASTSkeleton.compose({
        name: `${ds.prefix}-skeleton`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
