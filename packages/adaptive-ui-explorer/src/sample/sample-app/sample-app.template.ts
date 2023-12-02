import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { staticallyCompose } from "@microsoft/fast-foundation";
import { SamplePage } from "../sample-page/index.js";
import { dataAreaIcon, dataHistogramIcon, dataScatterIcon } from "../assets.js";
import { SampleApp } from "./sample-app.js";

SamplePage;

export function sampleAppTemplate<T extends SampleApp>(): ElementViewTemplate<T> {
    return html<T>`
        <app-layer-background class="wrapper" background-layer-recipe="-2">
            <div class="toolbar">
                <p>Adaptive sample app</p>
            </div>
            <adaptive-tabs orientation="vertical">
                <adaptive-tab id="tab-1" title="Area">
                    ${staticallyCompose(dataAreaIcon)}
                </adaptive-tab>
                <adaptive-tab id="tab-2" title="Histogram">
                    ${staticallyCompose(dataHistogramIcon)}
                </adaptive-tab>
                <adaptive-tab id="tab-3" title="Scatter">
                    ${staticallyCompose(dataScatterIcon)}
                </adaptive-tab>
                <adaptive-tab-panel id="tab-panel-1">
                    <app-layer-background class="content" background-layer-recipe="-1">
                        <div class="pane">
                            <adaptive-tree-view render-collapsed-nodes="false">
                                <adaptive-tree-item expanded>
                                    Root item 1
                                    <adaptive-tree-item expanded selected>
                                        Flowers
                                        <adaptive-tree-item>Daisy</adaptive-tree-item>
                                        <adaptive-tree-item disabled>
                                            Sunflower
                                        </adaptive-tree-item>
                                        <adaptive-tree-item expanded>
                                            Rose
                                            <adaptive-tree-item>Pink</adaptive-tree-item>
                                            <adaptive-tree-item>Red</adaptive-tree-item>
                                            <adaptive-tree-item>White</adaptive-tree-item>
                                        </adaptive-tree-item>
                                    </adaptive-tree-item>
                                    <adaptive-tree-item>Nested item 2</adaptive-tree-item>
                                    <adaptive-tree-item>Nested item 3</adaptive-tree-item>
                                </adaptive-tree-item>
                                <adaptive-tree-item>
                                    Root item 2
                                    <adaptive-tree-item>
                                        Flowers
                                        <adaptive-tree-item disabled>
                                            Daisy
                                        </adaptive-tree-item>
                                        <adaptive-tree-item>Sunflower</adaptive-tree-item>
                                        <adaptive-tree-item>Rose</adaptive-tree-item>
                                    </adaptive-tree-item>
                                    <adaptive-tree-item>Nested item 2</adaptive-tree-item>
                                    <adaptive-tree-item>Nested item 3</adaptive-tree-item>
                                </adaptive-tree-item>
                                <adaptive-tree-item>Root item 3</adaptive-tree-item>
                            </adaptive-tree-view>
                        </div>
                        <adaptive-card class="details"></adaptive-card>
                    </app-layer-background>
                </adaptive-tab-panel>
                <adaptive-tab-panel id="tab-panel-2">
                    <app-layer-background class="content" background-layer-recipe="-1">
                        <div class="pane">
                            <adaptive-listbox>
                                <adaptive-option>Item 1</adaptive-option>
                                <adaptive-option>Item 2</adaptive-option>
                                <adaptive-option>Item 3</adaptive-option>
                            </adaptive-listbox>
                        </div>
                        <adaptive-card class="details"></adaptive-card>
                    </app-layer-background>
                </adaptive-tab-panel>
                <adaptive-tab-panel id="tab-panel-3">
                    <app-layer-background class="content" background-layer-recipe="-1">
                        <app-sample-page></app-sample-page>
                    </app-layer-background>
                </adaptive-tab-panel>
            </adaptive-tabs>
        </app-layer-background>
    `;
}
