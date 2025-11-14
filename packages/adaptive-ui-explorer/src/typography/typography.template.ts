import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { Typography } from "./typography.js";

const singleLineText = html<Typography>`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
const multiLineText = html<Typography>`Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Sed do eiusmod tempor incididunt ut labore et dolore.`;

export function typographyTemplate<T extends Typography>(): ElementViewTemplate<T> {
    return html<T>`
        <div class="content${x => x.state.multiline ? ' multiline' : ''}">
            <p class="minus2">
                <span class="values">Minus 2 (font-size: ${x => x.minus2.fontSize}, line-height: ${x => x.minus2.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="minus1">
                <span class="values">Minus 1 (font-size: ${x => x.minus1.fontSize}, line-height: ${x => x.minus1.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="base">
                <span class="values">Base (font-size: ${x => x.base.fontSize}, line-height: ${x => x.base.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="plus1">
                <span class="values">Plus 1 (font-size: ${x => x.plus1.fontSize}, line-height: ${x => x.plus1.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="plus2">
                <span class="values">Plus 2 (font-size: ${x => x.plus2.fontSize}, line-height: ${x => x.plus2.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="plus3">
                <span class="values">Plus 3 (font-size: ${x => x.plus3.fontSize}, line-height: ${x => x.plus3.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="plus4">
                <span class="values">Plus 4 (font-size: ${x => x.plus4.fontSize}, line-height: ${x => x.plus4.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="plus5">
                <span class="values">Plus 5 (font-size: ${x => x.plus5.fontSize}, line-height: ${x => x.plus5.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
            <p class="plus6">
                <span class="values">Plus 6 (font-size: ${x => x.plus6.fontSize}, line-height: ${x => x.plus6.lineHeight})</span>
                <span class="sample-text">${x => x.state.multiline ? multiLineText : singleLineText}</span>
            </p>
        </div>
    `;
}
