import { html, repeat } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as dividerStoryTemplate } from "../divider/divider.stories.js";
import type { MenuItem as MenuItemElement } from "../menu-item/menu-item.js";
import { storyTemplate as menuItemStoryTemplate } from "../menu-item/menu-item.stories.js";
import type { Menu as MenuElement } from "./menu.js";

const storyTemplate = html<StoryArgs<MenuElement>>`
    <adaptive-menu
        slot="${x => x.slot}"
    >
        ${(x) => x.storyContent}
    </adaptive-menu>
`;

const storyContentTemplate = html`
    ${repeat(
        x => x.storyItems,
        html<StoryArgs<MenuItemElement>>`
            ${x => x.template ?? menuItemStoryTemplate}
        `
    )}
`;

export default {
    title: "Components/Menu",
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: storyContentTemplate,
        storyItems: [
            { storyContent: "Menu Item 1" },
            { storyContent: "Menu Item 2" },
            { storyContent: "Menu Item 3" },
        ],
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<MenuElement>;

export const Menu: Story<MenuElement> = renderComponent(storyTemplate).bind({});

export const MenuWithDivider: Story<MenuElement> = Menu.bind({});
MenuWithDivider.args = {
    storyItems: [
        { storyContent: "Menu Item 1" },
        { storyContent: "Menu Item 2" },
        { template: dividerStoryTemplate },
        { storyContent: "Menu Item 3" },
        { storyContent: "Menu Item 4" },
    ],
};

export const MenuWithCheckboxItems: Story<MenuElement> = Menu.bind({});
MenuWithCheckboxItems.args = {
    storyItems: [
        { storyContent: "Menu Item 1", type: "checkbox" },
        { storyContent: "Menu Item 2", type: "checkbox" },
        { storyContent: "Menu Item 3", type: "checkbox" },
    ],
};

export const MenuWithRadioItems: Story<MenuElement> = Menu.bind({});
MenuWithRadioItems.args = {
    storyItems: [
        { storyContent: "Menu Item 1", type: "radio" },
        { storyContent: "Menu Item 2", type: "radio" },
        { storyContent: "Menu Item 3", type: "radio" },
    ],
};

export const MenuWithNestedItems: Story<MenuElement> = Menu.bind({});
MenuWithNestedItems.args = {
    storyItems: [
        {
            storyContent: html`
                Menu Item 1
                ${repeat(x => x.storyItems, storyTemplate)}
            `,
            storyItems: [
                {
                    slot: "submenu",
                    storyContent: storyContentTemplate,
                    storyItems: [
                        { storyContent: "Menu Item 1.1" },
                        { storyContent: "Menu Item 1.2" },
                        { storyContent: "Menu Item 1.3" },
                    ],
                },
            ],
        },
        {
            storyContent: html`
                Menu Item 2
                ${repeat(x => x.storyItems, storyTemplate)}
            `,
            storyItems: [
                {
                    slot: "submenu",
                    storyContent: storyContentTemplate,
                    storyItems: [
                        {
                            storyContent: html`
                                Menu Item 2.1
                                ${repeat(x => x.storyItems, storyTemplate)}
                            `,
                            storyItems: [
                                {
                                    slot: "submenu",
                                    storyContent: storyContentTemplate,
                                    storyItems: [
                                        { storyContent: "Menu Item 2.1.1" },
                                        { storyContent: "Menu Item 2.1.2" },
                                        { storyContent: "Menu Item 2.1.3" },
                                    ],
                                },
                            ],
                        },
                        { storyContent: "Menu Item 2.2" },
                        { storyContent: "Menu Item 2.3" },
                    ],
                },
            ],
        },
        {
            storyContent: html`
                Menu Item 3
                ${repeat(x => x.storyItems, storyTemplate)}
            `,
            storyItems: [
                {
                    slot: "submenu",
                    storyContent: storyContentTemplate,
                    storyItems: [
                        { storyContent: "Menu Item 3.1" },
                        { storyContent: "Menu Item 3.2" },
                        { storyContent: "Menu Item 3.3" },
                    ],
                },
            ],
        },
    ],
};

export const MenuWithEverything = Menu.bind({});
MenuWithEverything.args = {
    storyItems: [
        {
            storyContent: html`
                Menu Item 1
            `,
        },
        {
            storyContent: html`
                Menu Item 2
                ${repeat(x => x.storyItems, storyTemplate)}
            `,
            storyItems: [
                {
                    slot: "submenu",
                    storyContent: storyContentTemplate,
                    storyItems: [
                        { storyContent: "Menu Item 2.1" },
                        { storyContent: "Menu Item 2.2" },
                        { storyContent: "Menu Item 2.3" },
                    ],
                },
            ],
        },
        {
            storyContent: html`
                Menu Item 3 (disabled)
            `,
            disabled: true,
        },
        { template: dividerStoryTemplate },
        {
            storyContent: html`
                Checkbox 1
            `,
            type: "checkbox",
        },
        { storyContent: "Checkbox 2", type: "checkbox" },
        { template: dividerStoryTemplate },
        { storyContent: "Radio 1.1", type: "radio" },
        { storyContent: "Radio 1.2", type: "radio" },
        { template: dividerStoryTemplate },
        { storyContent: "Radio 2.1", type: "radio" },
        { storyContent: "Radio 2.2", type: "radio" },
    ],
};

// A menu that opens is a popover, opened by a button's `commandfor`, which anchors it.
export const MenuButton: Story<MenuElement> = renderComponent(html<StoryArgs<MenuElement>>`
    <adaptive-button commandfor="story-menu" command="toggle-popover" aria-haspopup="menu">Open the menu</adaptive-button>
    <adaptive-menu id="story-menu" popover>
        ${(x) => x.storyContent}
    </adaptive-menu>
`).bind({});
MenuButton.args = MenuWithEverything.args;
