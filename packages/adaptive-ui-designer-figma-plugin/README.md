# Adaptive UI Figma Designer

A Figma Plugin for designing Adaptive UI web components and experiences.

## Building

To build the plugin, run `npm run build`. Then follow [Figma's documentation](https://help.figma.com/article/331-making-plugins) for importing the plugin into Figma.

You can also use `npm run start` to watch files and rebuild the plugin when files are changed.

## Usage

This plugin enables using certain parts of Adaptive UI in Figma. Currently, it supports applying design tokens for styling and editing design token values.

With the plugin open, selecting a node in Figma will cause the available options for that node type to be reflected in the UI. Applying an option from the Styling tab will update the appearance in Figma.

Applying a token to a node opts the node into the adaptive system, and assigning a background fill token higher in the Figma node tree will inform what the output color the downstream token is. Changing upstream nodes will cause all nodes downstream that have been assigned a token type to be re-evaluated, allowing you to keep an entire tree of nodes in sync with their background fill.

## Next Steps

This tool will be changing and evolving significantly. It will migrate to reading and building design system configuration through our extensions to the common design tokens file format.
