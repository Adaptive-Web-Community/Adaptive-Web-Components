import { FASTAvatar } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./avatar.styles.js";
import { AvatarAnatomy, template } from "./avatar.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeAvatar(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAvatar>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, AvatarAnatomy, options);

    return FASTAvatar.compose({
        name: `${ds.prefix}-avatar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
