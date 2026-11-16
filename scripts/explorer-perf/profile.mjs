// Profiles three changes in a build of the explorer with every background, and prints the functions that take the time.
//
//   node profile.mjs [dist] [neutral|toggle]
//
// Build the explorer unminified for names: `npx vite build --minify false --outDir <dir>` in packages/adaptive-ui-explorer.
// "self" is the time in a function itself, by name and line of the bundle; "inclusive" is the time in it and what it calls, by name.
import { distOf, launch, loaded, serve } from "./serve.mjs";

const dist = distOf(process.argv[2]);
const what = process.argv[3] ?? "neutral";
const { url, close } = serve(dist);
const browser = await launch();
const page = await browser.newPage();
const cdp = await page.context().newCDPSession(page);
await page.goto(url);
await loaded(page);
await page.evaluate(() => (document.querySelector("app-main").state.showOnlyLayerBackgrounds = false));
await page.waitForTimeout(1000);

await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 100 });
await cdp.send("Profiler.start");
await page.evaluate(async what => {
    const app = document.querySelector("app-main");
    for (let i = 0; i < 3; i++) {
        if (what === "toggle") app.state.showOnlyLayerBackgrounds = !app.state.showOnlyLayerBackgrounds;
        else app.state.neutralColor = { colorSpace: "srgb", components: [0.4 + i / 10, 0.4, 0.45], alpha: 1 };
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
}, what);
const { profile } = await cdp.send("Profiler.stop");
await browser.close();
close();

const nodes = new Map(profile.nodes.map(n => [n.id, n]));
const parents = new Map();
for (const n of profile.nodes) for (const child of n.children ?? []) parents.set(child, n.id);
const self = new Map(), inclusive = new Map();
let total = 0;
profile.samples.forEach((id, i) => {
    const ms = (profile.timeDeltas[i] ?? 0) / 1000;
    total += ms;
    const frame = nodes.get(id).callFrame;
    const key = `${frame.functionName || "(anonymous)"}:${frame.lineNumber + 1}`;
    self.set(key, (self.get(key) ?? 0) + ms);
    const seen = new Set();
    for (let n = id; n !== undefined; n = parents.get(n)) {
        const name = nodes.get(n).callFrame.functionName || "(anonymous)";
        if (!seen.has(name)) {
            seen.add(name);
            inclusive.set(name, (inclusive.get(name) ?? 0) + ms);
        }
    }
});
const top = (map, n) => [...map].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${v.toFixed(0).padStart(6)} ms  ${k}`).join("\n");
console.log(`${total.toFixed(0)} ms sampled\n-- self\n${top(self, 25)}\n-- inclusive\n${top(inclusive, 40)}`);
