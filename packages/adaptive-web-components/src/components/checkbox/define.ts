import checkmarkIcon from "@fluentui/svg-icons/icons/checkmark_16_regular.svg";
import subtractIcon from "@fluentui/svg-icons/icons/subtract_16_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./checkbox.definition.js";
import { CheckboxCheckedIndicatorKey, CheckboxIndeterminateIndicatorKey } from "./checkbox.template.js";

if (!DefaultDesignSystem.statics.has(CheckboxCheckedIndicatorKey)) {
    DefaultDesignSystem.statics.set(CheckboxCheckedIndicatorKey, checkmarkIcon)
}
if (!DefaultDesignSystem.statics.has(CheckboxIndeterminateIndicatorKey)) {
    DefaultDesignSystem.statics.set(CheckboxIndeterminateIndicatorKey, subtractIcon)
}

definition(DefaultDesignSystem).define();
