import type { DesignSystem } from "../../design-system.js";
import { AdaptiveButton } from "./button.js";
import { styles } from "./button.styles.js";
import { template } from "./button.template.js";

export const composeButton = (ds: DesignSystem) =>
    AdaptiveButton.compose({
        name: `${ds.prefix}-button`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
