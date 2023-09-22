import { attr, css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { StealthButton } from "../stealth-button/index.js";

StealthButton;

const template = html`
    <template class="${x => (x.expanded ? "expanded" : "collapsed")}">
        <div class="header">
            ${x => x.name}
            <designer-stealth-button
                class="expand-button"
                aria-label="Expand region"
                aria-controls="expanded-content collapsed-content"
                aria-expanded="${x => x.expanded.toString()}"
                @click="${(x, c) => x.handleExpandButtonClick(c.event)}"
            >
                <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M0 1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1Z"/>
                    <path d="M0 7a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7Z"/>
                    <path d="M6 1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z"/>
                    <path d="M6 7a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
            </designer-stealth-button>
        </div>
        <div class="expanded-content" role="region" id="expanded-content">
            <slot></slot>
        </div>
        <div class="collapsed-content" role="region" id="collapsed-content">
            <slot name="collapsed-content"></slot>
        </div>
        <template></template>
    </template>
`;

const styles = css`
    :host {
        display: block;
        border-bottom: 1px solid #efefef;
    }

    .header {
        display: flex;
        height: 48px;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        padding-left: 4px;
    }

    :host(.collapsed) .expanded-content,
    :host(.expanded) .collapsed-content {
        display: none;
    }

    :host(.expanded) .expanded-content,
    :host(.collapsed) .collapsed-content {
        display: block;
    }
`;

@customElement({
    name: "designer-drawer",
    template,
    styles,
})
export class Drawer extends FASTElement {
    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    @attr
    public name: string = "";

    private handleExpandButtonClick(): void {
        this.expanded = !this.expanded;
    }
}
