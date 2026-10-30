import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Anchor } from "./anchor.js";
import { aestheticStyles, templateStyles } from "./anchor.styles.js";
import { AnchorAnatomy, template } from "./anchor.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeAnchor(
    ds: DesignSystem,
    options?: ComposeOptions<Anchor>
): Promise<FASTElementDefinition<typeof Anchor>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, AnchorAnatomy, options);

    return FASTElementDefinition.compose(Anchor, {
        name: `${ds.prefix}-anchor`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
