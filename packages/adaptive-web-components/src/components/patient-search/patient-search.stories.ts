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
            dob: generateDate()
        });
    }
    return patients;
}

const generateDate = (): string => {
    let month: string  = `${Math.floor(Math.random() * 12) + 1}`
    if (month.length === 1) {
        month = `0${month}`
    }
    let day: string  = `${Math.floor(Math.random() * 28) + 1}`
    if (day.length === 1) {
        day = `0${day}`
    }
    return `${Math.floor(Math.random() * 20) + 2003}-${month}-${day}`
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

export const PatientSearchInitialParams: Story<PatientSearchBase> = renderComponent(
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
PatientSearchInitialParams.args = { 
}

export const PatientSearchNoData: Story<PatientSearchBase> = renderComponent(
    html<StoryArgs<PatientSearchBase>>`
    <adaptive-patient-search>
        ${(x) => x.storyContent}
    </adaptive-patient-search>
`
).bind({});
PatientSearchNoData.args = { 
}