import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Progress } from "./progress.js";
import { aestheticStyles, templateStyles } from "./progress.styles.js";
import { ProgressAnatomy, template } from "./progress.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeProgress(
    ds: DesignSystem,
    options?: ComposeOptions<Progress>
): Promise<FASTElementDefinition<typeof Progress>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, ProgressAnatomy, options);

    return FASTElementDefinition.compose(Progress, {
        name: `${ds.prefix}-progress`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
