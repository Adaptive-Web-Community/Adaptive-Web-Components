import chevronLeftIcon from "@fluentui/svg-icons/icons/chevron_left_16_regular.svg";
import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_16_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./flipper.definition.js";
import { FlipperNextKey, FlipperPreviousKey } from "./flipper.template.js";

if (!DefaultDesignSystem.statics.has(FlipperNextKey)) {
    DefaultDesignSystem.statics.set(FlipperNextKey, chevronRightIcon);
}
if (!DefaultDesignSystem.statics.has(FlipperPreviousKey)) {
    DefaultDesignSystem.statics.set(FlipperPreviousKey, chevronLeftIcon);
}

definition(DefaultDesignSystem).define();
