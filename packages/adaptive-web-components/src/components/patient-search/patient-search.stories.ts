import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import {Patient } from "../patient-list/patient-list.options.js";
import type { PatientSearch as PatientSearchBase } from "./patient-search.js";
import type { PatientSearchQueryChangeDetail, PatientSearchQueryResults } from "./patient-search.options.js";

const firstNames: string[]
 = [
    "Robert", "John", "Remi", "Howard", "Jeff", "Alex", "Sigmund", "Mark", "Marc", "Douglas", "Susan", "Ellen", 
    "Jaime", "Elizabeth", "Rick", "Joseph", "Joe", "Josephine", "Chris", "Melanie", "Donald", 
];

const middleNames: string[]
 = [...firstNames, "A", "", "J", "R"];

const lastNames: string[]
 = [
    "Smith", "Doe", "White", "Green", "Black", "Hunt", "Orange", "Red", "Walters", "Warren", "Adams", 
    "Addams", "Stark", "Bolton", "Big", "Small", "Snow", "Ross", "Roberts"
];

const generatePatients = (count: number): Patient[] => {
    const patients: Patient[] = [];
    for (let i:number = 0; i < count; i++ ) {
        patients.push({
            first: firstNames[Math.floor(Math.random() * firstNames.length)],
            middle: middleNames[Math.floor(Math.random() * middleNames.length)],
            last: lastNames[Math.floor(Math.random() * lastNames.length)],
            patientID: `${i}1234`,
            dob: `${Math.floor(Math.random() * 100) + 1920}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
        });
    }
    return patients;
}

const patients = generatePatients(500);

const handleUpdateQuery = (e: Event): void => {
    const detail: PatientSearchQueryChangeDetail = (e as CustomEvent).detail;
    const result: Patient[] = patients;
    (e.target as PatientSearchBase).queryResults = {query: detail.query, results: result};
}

export const storyTemplate = html<StoryArgs<PatientSearchBase>>`
    <adaptive-patient-search
        @querychange="${(x, c) => {
            if (!c.event.defaultPrevented) {
                handleUpdateQuery(c.event);
            }
        }}"
    >
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
} as Meta<PatientSearchBase>;

export const PatientSearch: Story<PatientSearchBase> = renderComponent(storyTemplate).bind({});

export const PatientSearchinitialParams: Story<PatientSearchBase> = renderComponent(
    html<StoryArgs<PatientSearchBase>>`
    <adaptive-patient-search
        :queryResults="${{
            query: {
                patientID: "",
                dob: "",
                first: "",
                middle: "",
                last: ""
            }, 
            results: patients
        }}"
    >
        ${(x) => x.storyContent}
    </adaptive-patient-search>
`
).bind({});
PatientSearchinitialParams.args = { 
}