import { program } from "commander";
import { spawnSync } from "node:child_process";
import path from "node:path";

import PackageJson from "../package.json";
import { GitGenerator } from "../src/git";

function main() {
  program.argument("submodule", "name of the submodule to deploy");
  program.parse();

  const { args } = program;
  const [submodule] = args;

  const commitMessage = GitGenerator.generateCommitMessage();

  runInSubmodule(submodule, "git", ["config", "user.name", "Daniel Chiu"]);
  runInSubmodule(submodule, "git", [
    "config",
    "user.email",
    "daniel@chiubaka.com",
  ]);
  runInSubmodule(submodule, "git", ["add", "."]);
  runInSubmodule(submodule, "git", ["commit", "-m", commitMessage]);
  runInSubmodule(submodule, "git", ["tag", `v${PackageJson.version}`]);
  runInSubmodule(submodule, "git", ["push"]);
  runInSubmodule(submodule, "git", ["push", "--tags"]);
}

function runInSubmodule(submodule: string, command: string, args: string[]) {
  const submodulePath = path.join(__dirname, `../generated`, submodule);

  spawnSync(command, args, {
    cwd: submodulePath,
    stdio: "inherit",
  });
}

main();
