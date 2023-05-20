import { html } from "@microsoft/fast-element";
import { FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTBreadcrumbItem>>`
    <adaptive-breadcrumb-item
        download="${(x) => x.download}"
        href="${(x) => x.href}"
        hreflang="${(x) => x.hreflang}"
        ping="${(x) => x.ping}"
        referrerpolicy="${(x) => x.referrerpolicy}"
        rel="${(x) => x.rel}"
        :separator="${(x) => x.separator}"
        target="${(x) => x.target}"
        type="${(x) => x.type}"
        :ariaAtomic="${(x) => x.ariaAtomic}"
        :ariaBusy="${(x) => x.ariaBusy}"
        :ariaControls="${(x) => x.ariaControls}"
        :ariaCurrent="${(x) => x.ariaCurrent}"
        :ariaDescribedby="${(x) => x.ariaDescribedby}"
        :ariaDetails="${(x) => x.ariaDetails}"
        :ariaDisabled="${(x) => x.ariaDisabled}"
        :ariaErrormessage="${(x) => x.ariaErrormessage}"
        :ariaExpanded="${(x) => x.ariaExpanded}"
        :ariaFlowto="${(x) => x.ariaFlowto}"
        :ariaHaspopup="${(x) => x.ariaHaspopup}"
        :ariaHidden="${(x) => x.ariaHidden}"
        :ariaInvalid="${(x) => x.ariaInvalid}"
        :ariaKeyshortcuts="${(x) => x.ariaKeyshortcuts}"
        :ariaLabel="${(x) => x.ariaLabel}"
        :ariaLabelledby="${(x) => x.ariaLabelledby}"
        :ariaLive="${(x) => x.ariaLive}"
        :ariaOwns="${(x) => x.ariaOwns}"
        :ariaRelevant="${(x) => x.ariaRelevant}"
        :ariaRoledescription="${(x) => x.ariaRoledescription}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-breadcrumb-item>
`;

export default {
    title: "Components/Breadcrumb Item",
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        download: { control: "text" },
        href: { control: "text" },
        hreflang: { control: "text" },
        ping: { control: "text" },
        referrerpolicy: { control: "text" },
        rel: { control: "text" },
        separator: { control: "boolean" },
        target: { control: "text" },
        type: { control: "text" },
        ariaAtomic: { control: "boolean" },
        ariaBusy: { control: "boolean" },
        ariaControls: { control: "text" },
        ariaCurrent: { control: "text" },
        ariaDescribedby: { control: "text" },
        ariaDetails: { control: "text" },
        ariaDisabled: { control: "boolean" },
        ariaErrormessage: { control: "text" },
        ariaExpanded: { control: "boolean" },
        ariaFlowto: { control: "text" },
        ariaHaspopup: { control: "boolean" },
        ariaHidden: { control: "boolean" },
        ariaInvalid: { control: "text" },
        ariaKeyshortcuts: { control: "text" },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
        ariaLive: { control: "text" },
        ariaOwns: { control: "text" },
        ariaRelevant: { control: "text" },
        ariaRoledescription: { control: "text" },
    },
} as Meta<FASTBreadcrumbItem>;

export const BreadcrumbItem: Story<FASTBreadcrumbItem> = renderComponent(storyTemplate).bind({});
BreadcrumbItem.args = {
    storyContent: "Breadcrumb Item",
};

export const BreadcrumbItemWithHref: Story<FASTBreadcrumbItem> = BreadcrumbItem.bind({});
BreadcrumbItemWithHref.args = {
    storyContent: "Breadcrumb item with href attribute",
    href: "https://github.com/Adaptive-Web-Community",
};
