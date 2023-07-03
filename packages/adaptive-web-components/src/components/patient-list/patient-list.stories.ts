import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { PatientList as PatientListBase } from "./patient-list.js";
import { Patient } from "./patient-list.options.js";

const patients: Patient[]
 = [
    {first: "John", middle: "John", last: "Doe", dob: "1969-01-01", patientID: "1234"},
    {first: "Ann", middle: "Susan", last: "Smith", dob: "1969-01-01", patientID: "1234"},
    {first: "White", middle: "Alan", last: "Smith", dob: "1969-01-01", patientID: "1234"},
    {first: "Jane", middle: "Agnes", last: "Doe", dob: "1969-01-01", patientID: "1234"},
    {first: "Robert", middle: "J", last: "Doyle", dob: "1969-01-01", patientID: "1234"},
    {first: "Alan", middle: "", last: "Jones", dob: "1969-01-01", patientID: "1234"},
    {first: "Aileen", middle: "", last: "Smith", dob: "1969-01-01", patientID: "1234"},
];

export const storyTemplate = html<StoryArgs<PatientListBase>>`
    <adaptive-patient-list
        :patients="${patients}"
    >
        ${(x) => x.storyContent}
    </adaptive-patient-list>
`;

export default {
    title: "Components/PatientList",
    includeStories: ["PatientList"],
    args: {
    },
    argTypes: {
    },
} as Meta<PatientListBase>;

export const PatientList: Story<PatientListBase> = renderComponent(storyTemplate).bind({});