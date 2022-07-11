import path from "node:path";
import { GeneratorOptions } from "yeoman-generator";

import { CircleCiGenerator } from "../circleci";
import { EsLintGenerator } from "../eslint";
import { GitignoreGenerator } from "../gitignore";
import { NodeModuleGenerator } from "../node-module";
import { BaseGenerator } from "../shared";
import { TestingGenerator } from "../testing";
import { TypeScriptGenerator } from "../typescript";

export class TypeScriptPackageGenerator extends BaseGenerator {
  constructor(args: string | string[], options: GeneratorOptions) {
    super(args, options, { customInstallTask: true });
  }

  public install() {
    const yarnArgs = ["install"];
    if (process.env.NODE_ENV === "test") {
      yarnArgs.push("--no-immutable");
    }

    this.spawnCommandSync("yarn", yarnArgs);
  }

  protected getSubGeneratorOptions() {
    return [
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
        Generator: EsLintGenerator,
        path: path.join(__dirname, "../eslint"),
      },
      {
        Generator: TestingGenerator,
        path: path.join(__dirname, "../testing"),
      },
      {
        Generator: CircleCiGenerator,
        path: path.join(__dirname, "../circleci"),
      },
    ];
  }
}
