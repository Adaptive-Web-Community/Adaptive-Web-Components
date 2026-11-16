# Adaptive UI Explorer

The Adaptive UI Explorer is an app for visualizing the effects of changing design token values and recipe configurations.

Currently the app is mostly illustrative of the color recipes, but it will soon be evolving into more of an editor for design system configuration, similar to what the Figma plugin provides within Figma.

Run it with `npm start`. Its settings are set on the token library of the canvas, and the canvas, each layer, and each background color is a scope: an element with a library that extends the one of the scope it is in, which writes the tokens whose values it changes and inherits the others (see `docs/decisions/0018-a-scope-writes-the-tokens-it-changes.md`).
