import { html, repeat } from "@microsoft/fast-element";
import { MenuItemType } from "@adaptive-web/components-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { MenuItem as MenuItemElement } from "./menu-item.js";

export const storyTemplate = html<StoryArgs<MenuItemElement>>`
    <adaptive-menu-item
        ?checked="${(x) =>x.checked}"
        ?disabled="${(x) =>x.disabled}"
        type="${(x) =>x.type}"
        :startColumns="${(x) =>x.startColumns ?? 0}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-menu-item>
`;

export default {
    title: "Components/Menu/Menu Item",
    excludeStories: ["storyTemplate"],
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: "Menu item",
        checked: false,
        disabled: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        checked: { control: "boolean", if: { arg: "type", neq: MenuItemType.item } },
        disabled: { control: "boolean" },
        type: { control: "select", options: Object.values(MenuItemType) },
        // Given by the menu, but set here for an item alone.
        startColumns: { table: { disable: true } },
    },
} as Meta<MenuItemElement>;

export const MenuItem: Story<MenuItemElement> = renderComponent(storyTemplate).bind({});

export const MenuItemCheckbox: Story<MenuItemElement> = renderComponent(
    html<StoryArgs<MenuItemElement>>`
        <div>
            ${repeat((x) => x.storyItems, storyTemplate)}
        </div>
    `
).bind({});
MenuItemCheckbox.args = {
    storyItems: [
        {
            storyContent: "Menu item checkbox (unchecked)",
            type: MenuItemType.checkbox,
            startColumns: 1,
        },
        {
            storyContent: "Menu item checkbox (checked)",
            checked: true,
            type: MenuItemType.checkbox,
            startColumns: 1,
        },
        {
            storyContent: "Menu item checkbox (unchecked, disabled)",
            checked: false,
            disabled: true,
            type: MenuItemType.checkbox,
            startColumns: 1,
        },
        {
            storyContent: "Menu item checkbox (checked, disabled)",
            checked: true,
            disabled: true,
            type: MenuItemType.checkbox,
            startColumns: 1,
        },
    ],
};

export const MenuItemRadio: Story<MenuItemElement> = renderComponent(
    html<StoryArgs<MenuItemElement>>`
        <div>
            ${repeat((x) => x.storyItems, storyTemplate)}
        </div>
    `
).bind({});
MenuItemRadio.args = {
    storyItems: [
        {
            storyContent: "Menu item radio (unchecked)",
            type: MenuItemType.radio,
            startColumns: 1,
        },
        {
            storyContent: "Menu item radio (checked)",
            checked: true,
            type: MenuItemType.radio,
            startColumns: 1,
        },
        {
            storyContent: "Menu item radio (unchecked, disabled)",
            checked: false,
            disabled: true,
            type: MenuItemType.radio,
            startColumns: 1,
        },
        {
            storyContent: "Menu item radio (checked, disabled)",
            checked: true,
            disabled: true,
            type: MenuItemType.radio,
            startColumns: 1,
        },
    ],
};
