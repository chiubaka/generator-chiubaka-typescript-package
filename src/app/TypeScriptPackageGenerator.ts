import path from "node:path";
import { GeneratorOptions } from "yeoman-generator";

import { CircleCiGenerator } from "../circleci";
import { GitignoreGenerator } from "../gitignore";
import { NodeModuleGenerator } from "../node-module";
import { BaseGenerator } from "../shared";
import { TestingGenerator } from "../testing";
import { TypeScriptGenerator } from "../typescript";

export class TypeScriptPackageGenerator extends BaseGenerator {
  constructor(args: string | string[], options: GeneratorOptions) {
    super(args, options, { customInstallTask: true });
  }

  public initializing() {
    this.composeWith([
      {
        Generator: GitignoreGenerator,
        path: path.join(__dirname, "../gitignore"),
      },
      {
        Generator: NodeModuleGenerator,
        path: path.join(__dirname, "../node-module"),
      },
      {
        Generator: TypeScriptGenerator,
        path: path.join(__dirname, "../typescript"),
      },
      {
        Generator: TestingGenerator,
        path: path.join(__dirname, "../testing"),
      },
      {
        Generator: CircleCiGenerator,
        path: path.join(__dirname, "../circleci"),
      },
    ]);
  }

  public install() {
    const yarnArgs = ["install"];
    if (process.env.NODE_ENV === "test") {
      yarnArgs.push("--no-immutable");
    }

    this.spawnCommandSync("yarn", ["set", "version", "3.2.1"]);
    this.spawnCommandSync("yarn", yarnArgs);
  }
}
