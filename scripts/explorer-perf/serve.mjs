// Serves a build of the explorer, and launches Chromium.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright-core";

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

/** The build of the explorer to measure: the argument, or its `dist`. */
export function distOf(arg) {
    const dir = resolve(arg ?? new URL("../../packages/adaptive-ui-explorer/dist", import.meta.url).pathname);
    if (!existsSync(join(dir, "index.html"))) {
        throw new Error(`No build of the explorer at ${dir}: run \`npm run build\` in packages/adaptive-ui-explorer, or give a directory`);
    }
    return dir;
}

/** Serves a directory on a free port, and returns its URL and a function that stops it. */
export function serve(dir) {
    const server = createServer(async (req, res) => {
        const path = join(dir, req.url === "/" ? "index.html" : req.url.split("?")[0]);
        try {
            const body = await readFile(path);
            res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
            res.end(body);
        } catch {
            res.writeHead(404).end();
        }
    }).listen(0);
    return { url: `http://localhost:${server.address().port}/`, close: () => server.close() };
}

/**
 * Chromium: `CHROME` if it is set, or the one Playwright installs (`npx playwright-core install chromium`).
 */
export function launch() {
    return chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
}

/** Waits until the app has rendered its first block of a background, and two frames after. */
export async function loaded(page) {
    await page.waitForFunction(() => document.querySelector("app-main")?.shadowRoot?.querySelector("app-color-block"));
    return page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(performance.now())))));
}
