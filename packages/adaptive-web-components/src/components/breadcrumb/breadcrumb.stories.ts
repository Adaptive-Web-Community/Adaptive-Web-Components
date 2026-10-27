import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Breadcrumb as BreadcrumbElement } from "./breadcrumb.js";

const storyTemplate = html<StoryArgs<BreadcrumbElement>>`
    <adaptive-breadcrumb aria-label="Breadcrumb">
        ${(x) => x.storyContent}
    </adaptive-breadcrumb>
`;

export default {
    title: "Components/Breadcrumb",
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<BreadcrumbElement>;

export const Breadcrumb: Story<BreadcrumbElement> = renderComponent(storyTemplate).bind({});
Breadcrumb.args = {
    storyContent: html`
        <adaptive-breadcrumb-item href="#">Breadcrumb Item 1</adaptive-breadcrumb-item>
        <adaptive-breadcrumb-item href="#">Breadcrumb Item 2</adaptive-breadcrumb-item>
        <adaptive-breadcrumb-item href="#">Breadcrumb Item 3</adaptive-breadcrumb-item>
    `,
};

export const BreadcrumbsWithTextSeparators: Story<BreadcrumbElement> = renderComponent(storyTemplate).bind({});
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
