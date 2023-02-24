# Adaptive UI Figma Designer

A Figma Plugin for designing Adaptive UI web components and experiences.

## Building

To build the plugin, run `npm run build`. Then follow [Figma's documentation](https://help.figma.com/article/331-making-plugins) for importing the plugin into Figma.

You can also use `npm run start` to watch files and rebuild the plugin when files are changed.

## Usage

This plugin enables using certain parts of Adaptive UI in Figma. Currently, it supports assigning recipes and editing design token values.

With the plugin open, selecting a node in Figma will cause the available options for that node type to be reflected in the UI. Assigning a recipe to the node will apply the recipe to the node.

Assigning a recipe to a node opts the node into the adaptive system, and assigning a background fill recipe higher in the Figma node tree will inform what the output color the downstream recipe is. Changing upstream nodes will cause all nodes downstream that have been assigned a recipe type to be re-evaluated, allowing you to keep an entire tree of nodes in sync with their background fill.

## Next Steps

This tool will be changing and evolving significantly. It will migrate to reading and building design system configuration through our extensions to the common design tokens file format.
