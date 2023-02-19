import { FASTAvatar } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./avatar.styles.js";
import { template } from "./avatar.template.js";

export const composeAvatar = (ds: DesignSystem) =>
    FASTAvatar.compose({
        name: `${ds.prefix}-avatar`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
