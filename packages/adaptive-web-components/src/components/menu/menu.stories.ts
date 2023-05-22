import { html, repeat } from "@microsoft/fast-element";
import type { FASTMenu, FASTMenuItem } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as dividerStoryTemplate } from "../divider/divider.stories.js";
import { storyTemplate as menuItemStoryTemplate } from "../menu-item/menu-item.stories.js";

const storyTemplate = html<StoryArgs<FASTMenu>>`
    <adaptive-menu
        slot="${x => x.slot}"
    >
        ${(x) => x.storyContent}
    </adaptive-menu>
`;

const storyContentTemplate = html`
    ${repeat(
        x => x.storyItems,
        html<StoryArgs<FASTMenuItem>>`
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
} as Meta<FASTMenu>;

export const Menu: Story<FASTMenu> = renderComponent(storyTemplate).bind({});

export const MenuWithDivider: Story<FASTMenu> = Menu.bind({});
MenuWithDivider.args = {
    storyItems: [
        { storyContent: "Menu Item 1" },
        { storyContent: "Menu Item 2" },
        { template: dividerStoryTemplate },
        { storyContent: "Menu Item 3" },
        { storyContent: "Menu Item 4" },
    ],
};

export const MenuWithCheckboxItems: Story<FASTMenu> = Menu.bind({});
MenuWithCheckboxItems.args = {
    storyItems: [
        { storyContent: "Menu Item 1", role: "menuitemcheckbox" },
        { storyContent: "Menu Item 2", role: "menuitemcheckbox" },
        { storyContent: "Menu Item 3", role: "menuitemcheckbox" },
    ],
};

export const MenuWithRadioItems: Story<FASTMenu> = Menu.bind({});
MenuWithRadioItems.args = {
    storyItems: [
        { storyContent: "Menu Item 1", role: "menuitemradio" },
        { storyContent: "Menu Item 2", role: "menuitemradio" },
        { storyContent: "Menu Item 3", role: "menuitemradio" },
    ],
};

export const MenuWithNestedItems: Story<FASTMenu> = Menu.bind({});
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
        { template: dividerStoryTemplate },
        {
            storyContent: html`
                Checkbox 1
            `,
            role: "menuitemcheckbox",
        },
        { storyContent: "Checkbox 2", role: "menuitemcheckbox" },
        { template: dividerStoryTemplate },
        { storyContent: "Radio 1.1", role: "menuitemradio" },
        { storyContent: "Radio 1.2", role: "menuitemradio" },
        { template: dividerStoryTemplate },
        { storyContent: "Radio 2.1", role: "menuitemradio" },
        { storyContent: "Radio 2.2", role: "menuitemradio" },
    ],
};
