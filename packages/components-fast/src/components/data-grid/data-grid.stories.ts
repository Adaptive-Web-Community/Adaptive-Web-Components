import { html } from "@microsoft/fast-element";
import { DataGridSelectionMode } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { GenerateHeaderOptions } from "./column-definition.js";
import type { DataGrid as DataGridElement } from "./data-grid.js";

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

const storyTemplate = html<StoryArgs<DataGridElement>>`
    <adaptive-data-grid
        generate-header="${(x) => x.generateHeader}"
        grid-template-columns="${(x) => x.gridTemplateColumns}"
        :rowsData="${(x) => x.rowsData}"
        selection-mode="${(x) => x.selectionMode}"
    ></adaptive-data-grid>
`;

export default {
    title: "Components/Data Grid",
    args: {
        rowsData: newDataSet(20),
    },
    argTypes: {
        generateHeader: { control: "radio", options: Object.values(GenerateHeaderOptions) },
        gridTemplateColumns: { control: "text" },
        selectionMode: { control: "select", options: Object.values(DataGridSelectionMode) },
    },
} as Meta<DataGridElement>;

export const DataGrid: Story<DataGridElement> = renderComponent(storyTemplate).bind({});

export const DataGridInMarkup: Story<DataGridElement> = renderComponent(html<StoryArgs<DataGridElement>>`
    <adaptive-data-grid selection-mode="${(x) => x.selectionMode}" grid-template-columns="1fr 2fr 1fr">
        <adaptive-data-grid-row row-type="header">
            <adaptive-data-grid-cell cell-type="columnheader">Name</adaptive-data-grid-cell>
            <adaptive-data-grid-cell cell-type="columnheader">Description</adaptive-data-grid-cell>
            <adaptive-data-grid-cell cell-type="columnheader">Action</adaptive-data-grid-cell>
        </adaptive-data-grid-row>
        <adaptive-data-grid-row>
            <adaptive-data-grid-cell cell-type="rowheader">Alpha</adaptive-data-grid-cell>
            <adaptive-data-grid-cell>The first</adaptive-data-grid-cell>
            <adaptive-data-grid-cell><adaptive-button>Edit</adaptive-button></adaptive-data-grid-cell>
        </adaptive-data-grid-row>
        <adaptive-data-grid-row>
            <adaptive-data-grid-cell cell-type="rowheader">Beta</adaptive-data-grid-cell>
            <adaptive-data-grid-cell>The second</adaptive-data-grid-cell>
            <adaptive-data-grid-cell><adaptive-button>Edit</adaptive-button></adaptive-data-grid-cell>
        </adaptive-data-grid-row>
    </adaptive-data-grid>
`).bind({});
