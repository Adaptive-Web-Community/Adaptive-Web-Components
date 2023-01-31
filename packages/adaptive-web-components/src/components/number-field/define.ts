import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import chevronUpIcon from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./number-field.definition.js";
import { NumberFieldStepDownIconKey, NumberFieldStepUpIconKey } from "./number-field.template.js";

if (!DefaultDesignSystem.statics.has(NumberFieldStepDownIconKey)) {
    DefaultDesignSystem.statics.set(NumberFieldStepDownIconKey, chevronDownIcon)
}
if (!DefaultDesignSystem.statics.has(NumberFieldStepUpIconKey)) {
    DefaultDesignSystem.statics.set(NumberFieldStepUpIconKey, chevronUpIcon)
}

definition(DefaultDesignSystem).define();
