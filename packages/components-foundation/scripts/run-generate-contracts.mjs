import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(packageRoot, "package.json"));
const generator = require.resolve("@adaptive-web/adaptive-ui/generate-typescript-contract");

const result = spawnSync(
    process.execPath,
    ["--import", "tsx", generator, "--scan", "src"],
    { cwd: packageRoot, stdio: "inherit" },
);

process.exit(result.status ?? 1);
