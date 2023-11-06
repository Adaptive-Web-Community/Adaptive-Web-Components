import { FASTCard } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./card.styles.js";
import { CardAnatomy, template } from "./card.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeCard(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCard>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, CardAnatomy, options);

    return FASTCard.compose({
        name: `${ds.prefix}-card`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
