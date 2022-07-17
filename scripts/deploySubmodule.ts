import { program } from "commander";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import packageJson from "../package.json";
import { GitGenerator } from "../src/git";

class SubmoduleDeployer {
  private static PROJECT_ROOT = path.join(__dirname, "../");

  private submodule: string;
  private submodulePath: string;

  constructor() {
    program.argument("submodule", "name of the submodule to deploy");
    program.parse();
    const { args } = program;
    const [submodule] = args;

    this.submodule = submodule;
    this.submodulePath = path.join(__dirname, `../generated`, submodule);
  }

  public run() {
    this.configureGitUser();

    this.updateSubmoduleVersion();

    this.gitCommitSubmodule();
    this.gitTagSubmodule();
    this.gitPushSubmodule();

    this.gitCommitProjectRoot();
    this.gitPushProjectRoot();
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
    this.spawnInProjectRoot("git", ["config", "user.name", "Daniel Chiu"]);
    this.spawnInProjectRoot("git", [
      "config",
      "user.email",
      "daniel@chiubaka.com",
    ]);
  }

  private gitCommitSubmodule() {
    const commitMessage = GitGenerator.generateCommitMessage();

    this.spawnInSubmodule("git", ["add", "."]);
    this.spawnInSubmodule("git", ["commit", "-m", commitMessage]);
  }

  private gitTagSubmodule() {
    this.spawnInSubmodule("git", ["tag", `v${packageJson.version}`]);
  }

  private gitPushSubmodule() {
    this.spawnInSubmodule("git", ["push"]);
    this.spawnInSubmodule("git", ["push", "--tags"]);
  }

  private gitCommitProjectRoot() {
    const commitMessage = `Update submodule ${this.submodule} to latest commit`;
    this.spawnInProjectRoot("git", ["add", "."]);
    this.spawnInProjectRoot("git", ["commit", "-m", commitMessage]);
  }

  private gitPushProjectRoot() {
    this.spawnInSubmodule("git", ["push"]);
  }

  private spawnInProjectRoot(command: string, args: string[]) {
    spawnSync(command, args, {
      cwd: SubmoduleDeployer.PROJECT_ROOT,
      stdio: "inherit",
    });
  }

  private spawnInSubmodule(command: string, args: string[]) {
    spawnSync(command, args, {
      cwd: this.submodulePath,
      stdio: "inherit",
    });
  }
}

const deployer = new SubmoduleDeployer();
deployer.run();
