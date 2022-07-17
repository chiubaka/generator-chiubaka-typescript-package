import { program } from "commander";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import packageJson from "../package.json";
import { GitGenerator } from "../src/git";

class SubmoduleDeployer {
  private submodulePath: string;

  constructor() {
    program.argument("submodule", "name of the submodule to deploy");
    program.parse();
    const { args } = program;
    const [submodule] = args;

    this.submodulePath = path.join(__dirname, `../generated`, submodule);
  }

  public run() {
    this.updateSubmoduleVersion();
    this.configureGitUser();
    this.gitCommit();
    this.gitTag();
    this.gitPush();
  }

  private updateSubmoduleVersion() {
    const submodulePackageJsonPath = path.join(
      this.submodulePath,
      "package.json"
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
    const submodulePackageJson = require(submodulePackageJsonPath) as {
      version: string;
    };

    submodulePackageJson.version = packageJson.version;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(
      submodulePackageJsonPath,
      JSON.stringify(submodulePackageJson, undefined, 2)
    );
  }

  private configureGitUser() {
    this.runInSubmodule("git", ["config", "user.name", "Daniel Chiu"]);
    this.runInSubmodule("git", ["config", "user.email", "daniel@chiubaka.com"]);
  }

  private gitCommit() {
    const commitMessage = GitGenerator.generateCommitMessage();

    this.runInSubmodule("git", ["add", "."]);
    this.runInSubmodule("git", ["commit", "-m", commitMessage]);
  }

  private gitTag() {
    this.runInSubmodule("git", ["tag", `v${packageJson.version}`]);
  }

  private gitPush() {
    this.runInSubmodule("git", ["push"]);
    this.runInSubmodule("git", ["push", "--tags"]);
  }

  private runInSubmodule(command: string, args: string[]) {
    spawnSync(command, args, {
      cwd: this.submodulePath,
      stdio: "inherit",
    });
  }
}

const deployer = new SubmoduleDeployer();
deployer.run();
