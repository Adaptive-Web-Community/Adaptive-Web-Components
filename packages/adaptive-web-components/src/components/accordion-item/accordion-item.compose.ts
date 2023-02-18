import { FASTAccordionItem } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./accordion-item.styles.js";
import { template } from "./accordion-item.template.js";

export const composeAccordionItem = (ds: DesignSystem) =>
    FASTAccordionItem.compose({
        name: `${ds.prefix}-accordion-item`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
