import { FASTSearch } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { AdaptiveSearch } from "./search.js";
import { aestheticStyles, templateStyles } from "./search.styles.js";
import { SearchAnatomy, template } from "./search.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSearch(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSearch>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, SearchAnatomy, options);

    return AdaptiveSearch.compose({
        name: `${ds.prefix}-search`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
