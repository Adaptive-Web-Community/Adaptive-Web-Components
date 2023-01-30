import { ElementViewTemplate } from "@microsoft/fast-element";
import { avatarTemplate, FASTAvatar } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Avatar template, {@link @microsoft/fast-foundation#avatarTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAvatar> =
    (ds: DesignSystem) =>
        avatarTemplate();
