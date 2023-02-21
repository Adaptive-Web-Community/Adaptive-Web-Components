import { FASTSearch } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./search.styles.js";
import { template } from "./search.template.js";

export function composeSearch(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSearch>
): FASTElementDefinition {
    return FASTSearch.compose({
        name: `${ds.prefix}-search`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}