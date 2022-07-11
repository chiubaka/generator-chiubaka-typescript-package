import path from "node:path";

import { BaseGenerator } from "../shared";
import GitHooksGenerator from "./git-hooks";

export class GitGenerator extends BaseGenerator {
  public writing() {
    this.spawnCommandSync("git", ["init"]);
  }

  protected getSubGeneratorOptions() {
    return [
      {
        Generator: GitHooksGenerator,
        path: path.join(__dirname, "./git-hooks"),
      },
    ];
  }
}
