import { FASTAccordion } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./accordion.styles.js";
import { template } from "./accordion.template.js";


export const composeAccordion = (ds: DesignSystem) =>
    FASTAccordion.compose({
        name: `${ds.prefix}-accordion`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
