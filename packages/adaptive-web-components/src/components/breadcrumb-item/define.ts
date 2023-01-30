import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./breadcrumb-item.definition.js";
import { BreadcrumbItemSeparatorKey } from "./breadcrumb-item.template.js";

if (!DefaultDesignSystem.statics.has(BreadcrumbItemSeparatorKey)) {
    DefaultDesignSystem.statics.set(BreadcrumbItemSeparatorKey, chevronRightIcon);
}

definition(DefaultDesignSystem).define();
