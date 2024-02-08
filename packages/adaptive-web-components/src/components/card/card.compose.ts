import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./card.styles.js";
import { CardAnatomy, template } from "./card.template.js";
import { Card } from "./card.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeCard(
    ds: DesignSystem,
    options?: ComposeOptions<Card>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, CardAnatomy, options);

    return Card.compose({
        name: `${ds.prefix}-card`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
