import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { SortableColumnHeader } from "./sortable-column-header.js";
import { aestheticStyles, templateStyles } from "./sortable-column-header.styles.js";
import { SortableColumnHeaderAnatomy, template } from "./sortable-column-header.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSortableColumnHeader(
    ds: DesignSystem,
    options?: ComposeOptions<SortableColumnHeader>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, SortableColumnHeaderAnatomy.interactivity, options);

    return SortableColumnHeader.compose({
        name: `${ds.prefix}-sortable-column-header`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
