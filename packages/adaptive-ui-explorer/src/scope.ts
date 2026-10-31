import { AdaptiveDesignSystem, componentBaseStyles } from "@adaptive-web/components-fast";
import { css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context.js";
import { type ExplorerLibrary, library } from "./library.js";

/**
 * The library of the scope that an element is in, or the explorer's library outside of any.
 */
export const ScopeLibrary = Context.create<ExplorerLibrary>("ScopeLibrary", library);

// The element that an element is in, across a shadow root.
function composedParent(element: Element): Element | null {
    if (element.parentElement) {
        return element.parentElement;
    }
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root.host : null;
}

/**
 * An element with a library of its own, which extends the library of the scope it is in, and whose shadow root has the tokens whose values
 * it changes. The elements in it inherit the others. See `docs/decisions/0018-a-scope-writes-the-tokens-it-changes.md`.
 *
 * @remarks
 * A subclass sets the values of the scope on its library in {@link ScopeElement.updateScope}, which is called when the element is connected,
 * and by {@link ScopeElement.scopeChanged} when a value changes.
 */
export class ScopeElement extends FASTElement {
    private _scope?: { readonly library: ExplorerLibrary; readonly inherits: ExplorerLibrary };

    constructor() {
        super();
        Context.handle(this, event => {
            event.stopImmediatePropagation();
            event.callback(this.library);
        }, ScopeLibrary);
    }

    /**
     * The library of the scope.
     *
     * @remarks
     * It is made when the element is first connected, or asked for by a scope in it, and kept while the element is in the same scope: the
     * tokens of an extended library stay subscribed to the ones they extend, so a library made for each connection would never be released.
     */
    public get library(): ExplorerLibrary {
        return this.scope.library;
    }

    public connectedCallback(): void {
        // Before the template is rendered, so the scopes in it extend this one.
        if (this._scope && this._scope.inherits !== this.parentLibrary()) {
            this._scope = undefined;
        }
        this.updateScope(this.library);
        super.connectedCallback();
        if (this.shadowRoot) {
            AdaptiveDesignSystem.adoptTokenStyles(this.shadowRoot, this.library);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.shadowRoot) {
            AdaptiveDesignSystem.removeTokenStyles(this.shadowRoot);
        }
    }

    /**
     * Sets the values of the scope on its library.
     *
     * @param library - The library of the scope
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected updateScope(library: ExplorerLibrary): void {}

    /**
     * A value of the scope changed. It is set on the library when the element is connected, and when it is connected otherwise.
     */
    protected scopeChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateScope(this.library);
        }
    }

    // The library of the scope, and the library of the scope it is in, which it inherits the custom properties of.
    private get scope(): { readonly library: ExplorerLibrary; readonly inherits: ExplorerLibrary } {
        if (!this._scope) {
            const inherits = this.parentLibrary();
            this._scope = { library: inherits.extend({}), inherits };
        }
        return this._scope;
    }

    private parentLibrary(): ExplorerLibrary {
        return ScopeLibrary.get(composedParent(this) ?? document);
    }
}

/**
 * A scope with no values of its own, whose library a parent sets values on, like the canvas of the app.
 */
@customElement({
    name: "app-scope",
    template: html`<slot></slot>`,
    styles: css`
        ${componentBaseStyles}

        :host {
            display: block;
        }
    `,
})
export class Scope extends ScopeElement {}
