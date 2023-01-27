import circleIcon from "@fluentui/svg-icons/icons/circle_16_filled.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./radio.definition.js";
import { RadioCheckedIndicatorKey } from "./radio.template.js";

if (!DefaultDesignSystem.statics.has(RadioCheckedIndicatorKey)) {
    DefaultDesignSystem.statics.set(RadioCheckedIndicatorKey, circleIcon)
}

definition(DefaultDesignSystem).define();
