import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import {Patient} from "../patient-list/patient-list.options.js";
import type { PatientSearch as PatientSearchBase } from "./patient-search.js";

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

export const storyTemplate = html<StoryArgs<PatientSearchBase>>`
    <adaptive-patient-search
        :allPatients = ${patients}
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