import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { PatientSearch } from "./patient-search.js";

export const storyTemplate = html<StoryArgs<PatientSearch>>`
    <adaptive-patient-search>
        ${(x) => x.storyContent}
    </adaptive-patient-search>
`;

export default {
    title: "Components/PatientSearch",
    excludeStories: ["storyTemplate"],
    args: {
    },
    argTypes: {
    },
} as Meta<PatientSearch>;

export const PatientSearchPane: Story<PatientSearch> = renderComponent(storyTemplate).bind({});