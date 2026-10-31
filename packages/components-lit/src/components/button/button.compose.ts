import { buttonAestheticStyles, buttonTemplateStyles, componentBaseStyles } from "@adaptive-web/components-foundation";
import type { ComposeOptions, DesignSystem, ElementDefinition } from "../../design-system.js";
import { Button } from "./button.js";
import { ButtonAnatomy, template } from "./button.template.js";

const defaultStyles = [componentBaseStyles, buttonTemplateStyles, buttonAestheticStyles];

/**
 * @public
 */
export function composeButton(ds: DesignSystem, options?: ComposeOptions<Button>): ElementDefinition<typeof Button> {
    const styles = ds.assembleStyles(defaultStyles, ButtonAnatomy, options);
    const render = (options?.template ?? template)(ds);

    return {
        name: `${ds.prefix}-button`,
        type: class extends Button {
            public static styles = styles;
            public static shadowRootOptions = { ...Button.shadowRootOptions, ...options?.shadowRootOptions };

            protected render() {
                return render(this);
            }
        },
        elementOptions: options?.elementOptions,
    };
}
