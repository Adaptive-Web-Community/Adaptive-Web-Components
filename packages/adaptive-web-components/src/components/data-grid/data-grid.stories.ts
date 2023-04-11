import { html } from "@microsoft/fast-element";
import { DataGridSelectionBehavior, DataGridSelectionMode, FASTDataGrid, GenerateHeaderOptions } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

function newDataRow(id: string): object {
    return {
        rowId: `rowid-${id}`,
        item1: `value 1-${id}`,
        item2: `value 2-${id}`,
        item3: `value 3-${id}`,
        item4: `value 4-${id}`,
        item5: `value 5-${id}`,
        item6: `value 6-${id}`,
    };
}

function newDataSet(rowCount: number): any[] {
    return Array.from({ length: rowCount }, (v, i) => newDataRow(`${i + 1}`));
}

const storyTemplate = html<StoryArgs<FASTDataGrid>>`
    <adaptive-data-grid
        disable-click-select="${(x) => x.disableClickSelect}"
        generate-header="${(x) => x.generateHeader}"
        grid-template-columns="${(x) => x.gridTemplateColumns}"
        initial-row-selection="${(x) => x.initialRowSelection}"
        no-tabbing="${(x) => x.noTabbing}"
        page-size="${(x) => x.pageSize}"
        :rowsData="${(x) => x.rowsData}"
        selection-behavior="${(x) => x.selectionBehavior}"
        selection-mode="${(x) => x.selectionMode}"
    ></adaptive-data-grid>
`;

export default {
    title: "Components/Data Grid",
    args: {
        rowsData: newDataSet(20),
    },
    argTypes: {
        disableClickSelect: { control: "boolean" },
        generateHeader: { control: "radio", options: Object.values(GenerateHeaderOptions) },
        gridTemplateColumns: { control: "text" },
        initialRowSelection: { control: "text" },
        noTabbing: { control: "boolean" },
        pageSize: { control: "number" },
        selectionBehavior: { control: "select", options: Object.values(DataGridSelectionBehavior) },
        selectionMode: { control: "select", options: Object.values(DataGridSelectionMode) },
    },
} as Meta<FASTDataGrid>;

export const DataGrid: Story<FASTDataGrid> = renderComponent(storyTemplate).bind({});
