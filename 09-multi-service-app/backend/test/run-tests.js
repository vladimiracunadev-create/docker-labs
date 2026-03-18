const { spawnSync } = require("node:child_process");

const args = ["--test"];

if (process.platform === "win32") {
  args.push("--test-isolation=none");
}

args.push("./test/app.test.js");

const result = spawnSync(process.execPath, args, {
  stdio: "inherit",
  shell: false,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
