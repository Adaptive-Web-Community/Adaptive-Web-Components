// The controllers work on DOM elements, so the tests run in JSDOM. JSDOM has no `ElementInternals`, and doesn't match
// `:disabled` on a custom element, so what depends on those is checked in a browser.

import "jsdom-global/register.js";

global.customElements = window.customElements;
