// Fill in some gaps required by fast-element for testing in JSDOM

import "jsdom-global/register.js";

global.MutationObserver = window.MutationObserver;

window.matchMedia = function() {}
