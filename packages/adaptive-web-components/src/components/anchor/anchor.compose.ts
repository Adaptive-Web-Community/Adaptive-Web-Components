import type { DesignSystem } from "../../design-system.js";
import { AdaptiveAnchor } from "./anchor.js";
import { styles } from "./anchor.styles.js";
import { template } from "./anchor.template.js";

export const composeAnchor = (ds: DesignSystem) =>
    AdaptiveAnchor.compose({
        name: `${ds.prefix}-anchor`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
