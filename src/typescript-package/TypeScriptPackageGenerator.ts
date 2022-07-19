import path from "node:path";
import { Question } from "yeoman-generator";

import { CircleCiGenerator } from "../circleci/index";
import { CodeAnalysisGenerator } from "../code-analysis/index";
import { EsLintGenerator } from "../eslint/index";
import { GitGenerator } from "../git/index";
import { GitHubGenerator, GitHubGeneratorOptions } from "../github/index";
import { GitignoreGenerator } from "../gitignore/index";
import {
  NodeModuleGenerator,
  NodeModuleGeneratorOptions,
} from "../node-module/index";
import { BaseGenerator } from "../shared/index";
import { TestingGenerator } from "../testing/index";
import { TypeScriptGenerator } from "../typescript/index";

export interface TypeScriptPackageGeneratorOptions
  extends NodeModuleGeneratorOptions,
    GitHubGeneratorOptions {}

export class TypeScriptPackageGenerator extends BaseGenerator<TypeScriptPackageGeneratorOptions> {
  public static getQuestions(): Question<TypeScriptPackageGeneratorOptions>[] {
    return [
      ...NodeModuleGenerator.getQuestions(),
      ...GitHubGenerator.getQuestions(),
    ];
  }

  public writing() {
    return;
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
        Generator: CodeAnalysisGenerator,
        path: path.join(__dirname, "../code-analysis"),
      },
      {
        Generator: GitHubGenerator,
        path: path.join(__dirname, "../github"),
      },
    ];
  };
}
