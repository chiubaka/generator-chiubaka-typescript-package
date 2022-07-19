import path from "node:path";
import { GeneratorOptions, Question } from "yeoman-generator";

import { BaseGenerator } from "../shared";
import TypeScriptPackageGenerator from "../typescript-package";

interface RootGeneratorOptions {
  config?: string;
  projectType: GeneratedProjectType;
}

enum GeneratedProjectType {
  TypeScriptPackage = "TypeScript Package",
}

export class RootGenerator extends BaseGenerator<RootGeneratorOptions> {
  constructor(
    args: string | string[],
    options: Partial<RootGeneratorOptions> & GeneratorOptions
  ) {
    super(args, options);

    if (this.options.config) {
      this.loadConfig(this.options.config);
    }
  }

  public static getQuestions(): Question<RootGeneratorOptions>[] {
    return [
      {
        type: "list",
        name: "projectType",
        message: "What kind of project do you want to generate?",
        choices: Object.values(GeneratedProjectType),
        default: GeneratedProjectType.TypeScriptPackage,
      },
    ];
  }

  protected configureSubGenerators() {
    const { projectType } = this.answers;

    if (projectType === GeneratedProjectType.TypeScriptPackage) {
      return [
        {
          Generator: TypeScriptPackageGenerator,
          path: path.join(__dirname, "../typescript-package"),
        },
      ];
    }

    return [];
  }

  public writing() {
    return;
  }
}
