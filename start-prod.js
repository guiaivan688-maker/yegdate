const path = require("path");
const { spawn } = require("child_process");
const nextBin = path.join(__dirname, "node_modules", "next", "dist", "bin", "next");
const port = process.env.PORT || "4000";
const child = spawn(process.execPath, [nextBin, "start", "-p", port], {
  stdio: "inherit",
  cwd: __dirname,
  env: { ...process.env, PORT: port },
});
child.on("exit", (code) => process.exit(code || 0));
