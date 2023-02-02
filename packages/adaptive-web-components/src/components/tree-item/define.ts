import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./tree-item.definition.js";
import { TreeItemExpandCollapseIconKey } from "./tree-item.template.js";

if (!DefaultDesignSystem.statics.has(TreeItemExpandCollapseIconKey)) {
    DefaultDesignSystem.statics.set(TreeItemExpandCollapseIconKey, chevronRightIcon);
}

definition(DefaultDesignSystem).define();
