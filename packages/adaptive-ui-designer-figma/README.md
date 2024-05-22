# Adaptive UI Designer Figma
Figma utilities and CLI for Adaptive UI.

## CLI
`@adaptive-web/adaptive-ui-designer-figma` exposes a CLI for generating component anatomies and stylesheets creating using the Adaptive UI Designer Figma Plugin. To use, first create a JSON library config file:
```JSON
{
    "libraryFile": "https//www.figma.com/file/path-to-file",
    "outDir": "./out/dir"
}
```

To use the CLI, run `npx aui-figma-compiler` and provide the library file that you just created. You will be prompted for a Figma PAT to access the file.

```shell
npx aui-figma-compiler -l ./library.json
```
