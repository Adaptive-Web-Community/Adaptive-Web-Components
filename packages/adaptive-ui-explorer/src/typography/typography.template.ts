import { type ElementViewTemplate, html, repeat } from "@microsoft/fast-element";
import { type TypeRampPosition, typeRampPositions } from "@adaptive-web/adaptive-ui";
import { Typography } from "./typography.js";

const singleLineText = html<TypeRampPosition, Typography>`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
const multiLineText = html<TypeRampPosition, Typography>`Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Sed do eiusmod tempor incididunt ut labore et dolore.`;

// "minus2" is "Minus 2", "base" is "Base".
function positionLabel(position: TypeRampPosition): string {
    return position.replace(/^(\w)(\D*)(\d*)$/, (_, first: string, rest: string, step: string) =>
        `${first.toUpperCase()}${rest}${step ? ` ${step}` : ""}`
    );
}

const positionTemplate = html<TypeRampPosition, Typography>`
    <p class="${x => x}">
        <span class="values">${(x, c) =>
            `${positionLabel(x)} (font-size: ${c.parent.values[x]?.fontSize}, line-height: ${c.parent.values[x]?.lineHeight})`
        }</span>
        <span class="sample-text">${(_, c) => c.parent.state.multiline ? multiLineText : singleLineText}</span>
    </p>
`;

export function typographyTemplate<T extends Typography>(): ElementViewTemplate<T> {
    return html<T>`
        <div class="content${x => x.state.multiline ? ' multiline' : ''}">
            ${repeat(() => typeRampPositions, positionTemplate)}
        </div>
    `;
}
