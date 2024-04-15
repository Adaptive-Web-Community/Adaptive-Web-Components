import fs from "fs";
import path from "path";
import { glob } from "glob";
import "./install-dom-shim.js";
import { ComposableStyles, ElementStyles } from "@microsoft/fast-element";
import { ElementStylesRenderer } from "./modules/element-styles-renderer.js";
import { StyleRules } from "./modules/types.js";

console.log("Adaptive UI build styles");
console.log("  working directory", process.cwd());

const options = {
    root: "dist/esm/components",
    stylesPath: "/**/*.styles.modules.js",
    // anatomyFile: "*.template.js",
};

function reduceStyles(
    styles: ReadonlyArray<ComposableStyles>
): string {
    return styles
        .map((x: ComposableStyles) =>
            x instanceof ElementStyles ? reduceStyles(x.styles) : x instanceof CSSStyleSheet ? "" /* ignore */ : x
        )
        .reduce((prev: string, curr: string) => prev.concat(curr), "");
}

glob(options.stylesPath, { root: options.root, absolute: false, posix: true }).then((stylesPaths: string[]) => {
    stylesPaths.sort().forEach(stylesPath => {
        console.log("  processing", stylesPath);

        // Get the component name from the path
        const pathRe = options.stylesPath
            .replace(/\./g, "\\.")
            .replace("**", "__COMPONENT__")
            .replace(/\*/g, ".*")
            .replace("__COMPONENT__", "(?<component>.*)");
        const re = new RegExp(`.*${pathRe}$`);
        const componentName = re.exec(stylesPath)?.groups?.["component"];

        // Process the styles file
        const fullStylesPath = path.join(process.cwd(), stylesPath);
        import(`file://${fullStylesPath}`).then((styles) => {
            const styleRules = styles["styleRules"] || styles["styleModules"] as StyleRules;

            // TODO: Support stronger resolution strategy to find styles and anatomy
            const fullAnatomyPath = fullStylesPath.replace("styles.modules", "template");
            import(`file://${fullAnatomyPath}`).then((template) => {
                const anatomyKey = Object.keys(template).find(key => key.indexOf("Anatomy") > -1);

                if (anatomyKey) {
                    const anatomy = template[anatomyKey];

                    const elementStyles = ElementStylesRenderer.renderStyleRules([], styleRules, anatomy);
                    const styles = reduceStyles(elementStyles.styles);

                    const outputPath = path.join(process.cwd(), path.parse(stylesPath).dir, `${componentName}.styles.css`);
                    console.log("    writing styles", outputPath);
                    fs.writeFileSync(outputPath, styles);
                }
            }).catch((reason: any) => {
                console.error(fullAnatomyPath, reason);
            });
        }).catch((reason: any) => {
            console.error(stylesPath, reason);
        });
    });    
}).catch((reason: any) => {
    console.log(`Error: ${reason}`);
});
