import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./avatar.styles.js";
import { AvatarAnatomy, template } from "./avatar.template.js";
import { Avatar } from "./avatar.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeAvatar(
    ds: DesignSystem,
    options?: ComposeOptions<Avatar>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, AvatarAnatomy, options);

    return Avatar.compose({
        name: `${ds.prefix}-avatar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
