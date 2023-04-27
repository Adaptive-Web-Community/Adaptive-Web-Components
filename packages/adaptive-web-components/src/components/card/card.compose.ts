import { FASTCard } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./card.styles.js";
import { CardAnatomy, template } from "./card.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeCard(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCard>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, CardAnatomy.interactivity, options);

    return FASTCard.compose({
        name: `${ds.prefix}-card`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
