import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Avatar } from "./avatar.js";
import { aestheticStyles, templateStyles } from "./avatar.styles.js";
import { AvatarAnatomy, template } from "./avatar.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeAvatar(
    ds: DesignSystem,
    options?: ComposeOptions<Avatar>
): Promise<FASTElementDefinition<typeof Avatar>> {
    const styles = ds.assembleStyles(defaultStyles, AvatarAnatomy, options);

    return FASTElementDefinition.compose(Avatar, {
        name: `${ds.prefix}-avatar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
