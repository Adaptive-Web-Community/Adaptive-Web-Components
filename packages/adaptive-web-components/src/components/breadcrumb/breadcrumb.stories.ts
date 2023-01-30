import { html } from "@microsoft/fast-element";
import type { FASTBreadcrumb } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTBreadcrumb>>`
    <adaptive-breadcrumb>
        ${(x) => x.storyContent}
    </adaptive-breadcrumb>
`;

export default {
    title: "Components/Breadcrumb",
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTBreadcrumb>;

export const Breadcrumb: Story<FASTBreadcrumb> = renderComponent(storyTemplate).bind({});
Breadcrumb.args = {
    storyContent: html`
        <adaptive-breadcrumb-item href="#">Breadcrumb Item 1</adaptive-breadcrumb-item>
        <adaptive-breadcrumb-item href="#">Breadcrumb Item 2</adaptive-breadcrumb-item>
        <adaptive-breadcrumb-item href="#">Breadcrumb Item 3</adaptive-breadcrumb-item>
    `,
};

export const BreadcrumbsWithTextSeparators: Story<FASTBreadcrumb> = renderComponent(storyTemplate).bind({});
BreadcrumbsWithTextSeparators.args = {
    storyContent: html`
        <adaptive-breadcrumb-item href="#">
            Breadcrumb Item 1
            <span slot="separator">/</span>
        </adaptive-breadcrumb-item>
        <adaptive-breadcrumb-item href="#">
            Breadcrumb Item 2
            <span slot="separator">/</span>
        </adaptive-breadcrumb-item>
        <adaptive-breadcrumb-item href="#">
            Breadcrumb Item 3
            <span slot="separator">/</span>
        </adaptive-breadcrumb-item>
    `,
};

export const BreadcrumbsWithAnchors: Story<FASTBreadcrumb> = renderComponent(storyTemplate).bind({});
BreadcrumbsWithAnchors.args = {
    storyContent: html`
        <a href="#">Breadcrumb Item 1</a>
        <a href="#">Breadcrumb Item 2</a>
        <a href="#">Breadcrumb Item 3</a>
    `,
};
