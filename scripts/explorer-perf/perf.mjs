// Measures a build of the explorer in Chromium.
//
//   node perf.mjs [dist] [runs]       dist: a build of the explorer (its `dist` by default); runs: 1 by default, the median of each
//
// What it reports, for each value the median of the runs:
// - load: ms from navigation to the first render of the backgrounds
// - defaultView, allView: the blocks of a background, the scopes (shadow roots with a `:host` sheet of custom properties), and their
//   declarations and bytes, with the default backgrounds (10) and every background (66)
// - neutralDefault, neutralAll: ms for a change of the neutral color, until two frames after it
// - writesPerNeutralChange: the token sheets written for one change with every background (1 per scope is the least)
// - toggleToAll, toggleMedian: ms to show every background, the first time and over 20 toggles
// - heap*: MB after GC, loaded, with every background, after 50 changes, after 20 toggles; it stays flat when nothing leaks
import { distOf, launch, loaded, serve } from "./serve.mjs";

const dist = distOf(process.argv[2]);
const runs = Number(process.argv[3] ?? 1);
const median = xs => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const { url, close } = serve(dist);
const browser = await launch();

const results = [];
for (let run = 0; run < runs; run++) {
    const page = await browser.newPage();
    const cdp = await page.context().newCDPSession(page);
    const heap = async () => {
        await cdp.send("HeapProfiler.collectGarbage");
        await cdp.send("HeapProfiler.collectGarbage");
        return (await cdp.send("Runtime.getHeapUsage")).usedSize / 1e6;
    };
    const errors = [];
    page.on("pageerror", e => errors.push(String(e)));
    // Counts the token sheets written, which the design system writes with replaceSync.
    await page.addInitScript(() => {
        const replaceSync = CSSStyleSheet.prototype.replaceSync;
        window.__tokenWrites = 0;
        CSSStyleSheet.prototype.replaceSync = function (text) {
            if (text.startsWith(":host{") || text.startsWith(":root{")) window.__tokenWrites++;
            return replaceSync.call(this, text);
        };
    });

    await page.goto(url);
    const r = { load: await loaded(page) };

    // A change of the neutral color, or a toggle of every background, n times, each until two frames after it. Each color is new: setting
    // the same one again changes nothing.
    const measure = (n, toggle) =>
        page.evaluate(
            async ({ n, toggle }) => {
                const frames = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
                const app = document.querySelector("app-main");
                const times = [];
                for (let i = 0; i < n; i++) {
                    const t = performance.now();
                    if (toggle) {
                        app.state.showOnlyLayerBackgrounds = !app.state.showOnlyLayerBackgrounds;
                    } else {
                        app.state.neutralColor = { colorSpace: "srgb", components: [0.3 + Math.random() * 0.4, 0.4, 0.45], alpha: 1 };
                    }
                    await frames();
                    times.push(performance.now() - t);
                }
                return times;
            },
            { n, toggle }
        );
    const writes = async () => {
        await page.evaluate(() => (window.__tokenWrites = 0));
        await measure(1, false);
        await page.waitForTimeout(200);
        return page.evaluate(() => window.__tokenWrites);
    };
    const sheets = () =>
        page.evaluate(() => {
            let scopes = 0, declarations = 0, bytes = 0, blocks = 0;
            const visit = root => {
                for (const el of root.querySelectorAll("*")) {
                    if (el.localName === "app-color-block") blocks++;
                    if (!el.shadowRoot) continue;
                    for (const sheet of el.shadowRoot.adoptedStyleSheets) {
                        const rule = sheet.cssRules[0];
                        if (sheet.cssRules.length === 1 && rule.selectorText === ":host" && rule.style.length && rule.style[0].startsWith("--")) {
                            scopes++;
                            declarations += rule.style.length;
                            bytes += rule.cssText.length;
                        }
                    }
                    visit(el.shadowRoot);
                }
            };
            visit(document);
            return { blocks, scopes, declarations, bytes };
        });

    r.heapLoaded = await heap();
    r.defaultView = await sheets();
    r.neutralDefault = median((await measure(12, false)).slice(2));
    r.toggleToAll = (await measure(1, true))[0];
    r.allView = await sheets();
    r.neutralAll = median((await measure(12, false)).slice(2));
    r.writesPerNeutralChange = await writes();
    r.heapAll = await heap();
    await measure(1, true);
    await measure(50, false);
    r.heapAfter50Changes = await heap();
    r.toggleMedian = median(await measure(20, true));
    r.heapAfter20Toggles = await heap();
    r.errors = errors;
    results.push(r);
    await page.close();
}

await browser.close();
close();

const out = {};
for (const key of Object.keys(results[0])) {
    const values = results.map(r => r[key]);
    out[key] = typeof values[0] === "number" ? Number(median(values).toFixed(1)) : values[0];
}
console.log(JSON.stringify(out, null, 1));
