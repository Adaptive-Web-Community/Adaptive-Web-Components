import { FASTAvatar } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./avatar.styles.js";
import { template } from "./avatar.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeAvatar(
    ds: DesignSystem,
    options?: ComposeOptions<FASTAvatar>
): FASTElementDefinition {
    return FASTAvatar.compose({
        name: `${ds.prefix}-avatar`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}