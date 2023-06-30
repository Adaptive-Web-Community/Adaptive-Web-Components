import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { PatientSearch as PatientSearchBase } from "./patient-search.js";

export const storyTemplate = html<StoryArgs<PatientSearchBase>>`
    <adaptive-patient-search>
        ${(x) => x.storyContent}
    </adaptive-patient-search>
`;

export default {
    title: "Components/PatientSearch",
    includeStories: ["PatientSearch"],
    args: {
    },
    argTypes: {
    },
} as Meta<PatientSearchBase>;

export const PatientSearch: Story<PatientSearchBase> = renderComponent(storyTemplate).bind({});