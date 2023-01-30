import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./select.definition.js";
import { SelectIndicatorKey } from "./select.template.js";

if (!DefaultDesignSystem.statics.has(SelectIndicatorKey)) {
    DefaultDesignSystem.statics.set(SelectIndicatorKey, chevronDownIcon);
}

definition(DefaultDesignSystem).define();
