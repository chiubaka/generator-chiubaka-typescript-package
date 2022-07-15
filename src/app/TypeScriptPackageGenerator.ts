import path from "node:path";
import { GeneratorOptions, Question } from "yeoman-generator";

import { CircleCiGenerator } from "../circleci";
import { EsLintGenerator } from "../eslint";
import { GitGenerator } from "../git";
import { GitHubGenerator, GitHubGeneratorOptions } from "../github/index";
import { GitignoreGenerator } from "../gitignore";
import {
  NodeModuleGenerator,
  NodeModuleGeneratorOptions,
} from "../node-module";
import { BaseGenerator } from "../shared";
import { TestingGenerator } from "../testing";
import { TypeScriptGenerator } from "../typescript";

export interface TypeScriptPackageGeneratorOptions
  extends NodeModuleGeneratorOptions,
    GitHubGeneratorOptions {
  config?: string;
}

export class TypeScriptPackageGenerator extends BaseGenerator<TypeScriptPackageGeneratorOptions> {
  public static getQuestions(): Question<TypeScriptPackageGeneratorOptions>[] {
    return [
      ...NodeModuleGenerator.getQuestions(),
      ...GitHubGenerator.getQuestions(),
    ];
  }

  constructor(
    args: string | string[],
    options: Partial<TypeScriptPackageGeneratorOptions> & GeneratorOptions
  ) {
    super(args, options, { customInstallTask: true });

    if (this.options.config) {
      this.loadConfig(this.options.config);
    }
  }

  protected configureSubGenerators = () => {
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
        Generator: GitGenerator,
        path: path.join(__dirname, "../git"),
      },
      {
        Generator: CircleCiGenerator,
        path: path.join(__dirname, "../circleci"),
      },
      {
        Generator: GitHubGenerator,
        path: path.join(__dirname, "../github"),
      },
    ];
  };
}
