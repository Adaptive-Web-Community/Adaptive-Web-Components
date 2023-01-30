import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./combobox.definition.js";
import { ComboboxIndicatorKey } from "./combobox.template.js";

if (!DefaultDesignSystem.statics.has(ComboboxIndicatorKey)) {
    DefaultDesignSystem.statics.set(ComboboxIndicatorKey, chevronDownIcon)
}

definition(DefaultDesignSystem).define();
