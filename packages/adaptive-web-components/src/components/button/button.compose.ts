import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Button } from "./button.js";
import { aestheticStyles, templateStyles } from "./button.styles.js";
import { ButtonAnatomy, template } from "./button.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeButton(
    ds: DesignSystem,
    options?: ComposeOptions<Button>
): Promise<FASTElementDefinition<typeof Button>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, ButtonAnatomy, options);

    return FASTElementDefinition.compose(Button, {
        name: `${ds.prefix}-button`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
