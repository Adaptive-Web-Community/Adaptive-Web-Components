// The controllers work on DOM elements, so the tests run in JSDOM. JSDOM has no `ElementInternals`, and doesn't match
// `:disabled` on a custom element, so what depends on those is checked in a browser.

import "jsdom-global/register.js";

global.customElements = window.customElements;
global.MutationObserver = window.MutationObserver;
global.SVGElement = window.SVGElement;
global.FocusEvent = window.FocusEvent;

// JSDOM has no CommandEvent: this has what the HTML standard gives it.
global.CommandEvent = class CommandEvent extends window.Event {
    constructor(type, init = {}) {
        super(type, init);
        this.command = init.command ?? "";
        this.source = init.source ?? null;
    }
};
