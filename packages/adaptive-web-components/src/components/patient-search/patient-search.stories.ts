import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { PatientSearch as PatientSearchBase } from "./patient-search.js";

const firstNameSuggestions = ["John", "Jane"];
const middleNameSuggestions = ["A", "B"];
const lastNameSuggestions = ["Doe", "Smith"];
const patientIdSuggestions = ["1aaaaaaaa", "2aaaaaaaa"];

export const storyTemplate = html<StoryArgs<PatientSearchBase>>`
    <adaptive-patient-search
        :firstNameSuggestions = ${firstNameSuggestions}
        :middleNameSuggestions = ${middleNameSuggestions}
        :lastNameSuggestions = ${lastNameSuggestions}
        :patientIdSuggestions = ${patientIdSuggestions}
    >
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