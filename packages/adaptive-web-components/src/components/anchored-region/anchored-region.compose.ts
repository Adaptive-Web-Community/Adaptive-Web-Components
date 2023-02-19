import { FASTAnchoredRegion } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./anchored-region.styles.js";
import { template } from "./anchored-region.template.js";

export const composeAnchoredRegion = (ds: DesignSystem) =>
    FASTAnchoredRegion.compose({
        name: `${ds.prefix}-anchored-region`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
