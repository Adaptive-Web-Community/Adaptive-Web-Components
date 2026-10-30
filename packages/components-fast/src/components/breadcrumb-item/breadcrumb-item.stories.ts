import { html } from "@microsoft/fast-element";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { BreadcrumbItem as BreadcrumbItemElement } from "./breadcrumb-item.js";

const storyTemplate = html<StoryArgs<BreadcrumbItemElement>>`
    <adaptive-breadcrumb-item
        download="${(x) => x.download}"
        href="${(x) => x.href}"
        hreflang="${(x) => x.hreflang}"
        ping="${(x) => x.ping}"
        referrerpolicy="${(x) => x.referrerPolicy}"
        rel="${(x) => x.rel}"
        target="${(x) => x.target}"
        type="${(x) => x.type}"
        :current="${(x) => x.current}"
        aria-atomic="${(x) => x.ariaAtomic}"
        aria-busy="${(x) => x.ariaBusy}"
        aria-controls="${(x) => x.ariaControls}"
        aria-current="${(x) => x.ariaCurrent}"
        aria-describedby="${(x) => x.ariaDescribedby}"
        aria-details="${(x) => x.ariaDetails}"
        aria-disabled="${(x) => x.ariaDisabled}"
        aria-errormessage="${(x) => x.ariaErrormessage}"
        aria-expanded="${(x) => x.ariaExpanded}"
        aria-flowto="${(x) => x.ariaFlowto}"
        aria-haspopup="${(x) => x.ariaHaspopup}"
        aria-hidden="${(x) => x.ariaHidden}"
        aria-invalid="${(x) => x.ariaInvalid}"
        aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
        aria-label="${(x) => x.ariaLabel}"
        aria-labelledby="${(x) => x.ariaLabelledby}"
        aria-live="${(x) => x.ariaLive}"
        aria-owns="${(x) => x.ariaOwns}"
        aria-relevant="${(x) => x.ariaRelevant}"
        aria-roledescription="${(x) => x.ariaRoledescription}"
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
        referrerPolicy: { control: "text" },
        rel: { control: "text" },
        current: { control: "boolean" },
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
} as Meta<BreadcrumbItemElement>;

export const BreadcrumbItem: Story<BreadcrumbItemElement> = renderComponent(storyTemplate).bind({});
BreadcrumbItem.args = {
    storyContent: "Breadcrumb Item",
};

export const BreadcrumbItemWithHref: Story<BreadcrumbItemElement> = BreadcrumbItem.bind({});
BreadcrumbItemWithHref.args = {
    storyContent: "Breadcrumb item with href attribute",
    href: "https://github.com/Adaptive-Web-Community",
};
