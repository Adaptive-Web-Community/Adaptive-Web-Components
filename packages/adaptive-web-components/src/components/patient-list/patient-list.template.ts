import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { DataGridSelectionMode, FASTDataGridCell } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { PatientList } from "./patient-list.js"

/**
 * @public
 */
export const PatientListConditions = {
};

/**
 * @public
 */
export const PatientListParts = {
};

/**
 * @public
 */
export const PatientListAnatomy: ComponentAnatomy<typeof PatientListConditions, typeof PatientListParts> = {
    interactivity: Interactivity.never,
    conditions: PatientListConditions,
    parts: PatientListParts,
};

export const headerSortCellTemplate = html<FASTDataGridCell>`
<template>
    <adaptive-sortable-column-header
      :columnDefinition = ${ x => x.columnDefinition }
      class="header-sort-button"
      @click="${(x) => x.$emit('updatesort', x.columnDefinition)}"
    >
        ${ x => x.columnDefinition?.title }
    </adaptive-sortable-column-header>
  </template>
`;

function getFocusTarget(cell: FASTDataGridCell): HTMLElement {
    return cell.children[0] as HTMLElement;
}

const columnDefinitions = [
    {
        columnDataKey: "patientID",
        title: PatientList.stringsProvider.patientIDColumnTitle,
        headerCellTemplate: headerSortCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    {
        columnDataKey: "last",
        title: PatientList.stringsProvider.lastNameColumnTitle,
        headerCellTemplate: headerSortCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    {
        columnDataKey: "first",
        title: PatientList.stringsProvider.firstNameColumnTitle,
        headerCellTemplate: headerSortCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    {
        columnDataKey: "middle",
        title: PatientList.stringsProvider.middleNameColumnTitle,
        headerCellTemplate: headerSortCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
    {
        columnDataKey: "dob",
        title: PatientList.stringsProvider.dobColumnTitle,
        headerCellTemplate: headerSortCellTemplate,
        headerCellFocusTargetCallback: getFocusTarget,
    },
]

/**
 * Template for patient-list component.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<PatientList> =
    (ds: DesignSystem) =>
    patientListTemplate();

function patientListTemplate<T extends PatientList>(): ElementViewTemplate<T> {
    return html`
        <template>
            <adaptive-data-grid
                ${ref("patientGrid")}
                class="patient-grid"
                selection-mode="${DataGridSelectionMode.singleRow}"
                :columnDefinitions="${columnDefinitions}"
                :gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
                :rowsData="${ x => x.patients}"
                @selectionchange="${(x, c) => x.selectionChange()}"
            >
            </adaptive-data-grid>
        </template>
    `;
}
