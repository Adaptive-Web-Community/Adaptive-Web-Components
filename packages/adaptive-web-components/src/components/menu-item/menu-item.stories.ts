import { html, repeat } from "@microsoft/fast-element";
import { FASTMenuItem, MenuItemRole } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

export const storyTemplate = html<StoryArgs<FASTMenuItem>>`
    <adaptive-menu-item
        ?checked="${(x) =>x.checked}"
        ?disabled="${(x) =>x.disabled}"
        ?expanded="${(x) =>x.expanded}"
        role="${(x) =>x.role}"
        start-column-count="${(x) =>x.startColumnCount}"
    >
        ${(x) =>x.storyContent}
    </adaptive-menu-item>
`;

export default {
    title: "Components/Menu/Menu Item",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Menu item",
        checked: false,
        disabled: false,
        expanded: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        checked: { control: "boolean", if: { arg: "role", neq: MenuItemRole.menuitem } },
        disabled: { control: "boolean" },
        expanded: { control: "boolean" },
        role: { control: "select", options: Object.values(MenuItemRole) },
        // Managed by AdaptiveMenu, but here we need to set manually.
        startColumnCount: { table: { disable: true } },
    },
} as Meta<FASTMenuItem>;

export const MenuItem: Story<FASTMenuItem> = renderComponent(storyTemplate).bind({});

export const MenuItemCheckbox: Story<FASTMenuItem> = renderComponent(
    html<StoryArgs<FASTMenuItem>>`
        <div>
            ${repeat((x) => x.storyItems, storyTemplate)}
        </div>
    `
).bind({});
MenuItemCheckbox.args = {
    storyItems: [
        {
            storyContent: "Menu item checkbox (unchecked)",
            role: MenuItemRole.menuitemcheckbox,
            startColumnCount: 1,
        },
        {
            storyContent: "Menu item checkbox (checked)",
            checked: true,
            role: MenuItemRole.menuitemcheckbox,
            startColumnCount: 1,
        },
        {
            storyContent: "Menu item checkbox (unchecked, disabled)",
            checked: false,
            disabled: true,
            role: MenuItemRole.menuitemcheckbox,
            startColumnCount: 1,
        },
        {
            storyContent: "Menu item checkbox (checked, disabled)",
            checked: true,
            disabled: true,
            role: MenuItemRole.menuitemcheckbox,
            startColumnCount: 1,
        },
    ],
};

export const MenuItemRadio: Story<FASTMenuItem> = renderComponent(
    html<StoryArgs<FASTMenuItem>>`
        <div>
            ${repeat((x) => x.storyItems, storyTemplate)}
        </div>
    `
).bind({});
MenuItemRadio.args = {
    storyItems: [
        {
            storyContent: "Menu item radio (unchecked)",
            role: MenuItemRole.menuitemradio,
            startColumnCount: 1,
        },
        {
            storyContent: "Menu item radio (checked)",
            checked: true,
            role: MenuItemRole.menuitemradio,
            startColumnCount: 1,
        },
        {
            storyContent: "Menu item radio (unchecked, disabled)",
            checked: false,
            disabled: true,
            role: MenuItemRole.menuitemradio,
            startColumnCount: 1,
        },
        {
            storyContent: "Menu item radio (checked, disabled)",
            checked: true,
            disabled: true,
            role: MenuItemRole.menuitemradio,
            startColumnCount: 1,
        },
    ],
};
