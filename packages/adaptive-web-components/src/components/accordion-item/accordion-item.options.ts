import type { AccordionItemOptions } from "@microsoft/fast-foundation";
import type { ComposeOptions } from "../../design-system.js";
import chevronDown from "../../statics/chevron-down.js";
import chevronUp from "../../statics/chevron-up.js";

export default {
    baseName: "accordion-item",
    templateOptions: {
        collapsedIcon: chevronDown,
        expandedIcon: chevronUp
    }
} as ComposeOptions<AccordionItemOptions>;