import { FASTBadge } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./badge.styles.js";
import { template } from "./badge.template.js";

export const composeBadge = (ds: DesignSystem) =>
    FASTBadge.compose({
        name: `${ds.prefix}-badge`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
