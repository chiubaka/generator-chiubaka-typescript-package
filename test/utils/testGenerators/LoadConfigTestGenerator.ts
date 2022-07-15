import path from "node:path";
import { GeneratorOptions, Question } from "yeoman-generator";

import { BaseGenerator } from "../../../src/shared";

export interface LoadConfigTestGeneratorOptions {
  packageName: string;
  packageDescription: string;
}

export class LoadConfigTestGenerator extends BaseGenerator<LoadConfigTestGeneratorOptions> {
  public static getQuestions(): Question<LoadConfigTestGeneratorOptions>[] {
    return [
      {
        type: "input",
        name: "packageName",
        message: "What is the name of this package?",
      },
      {
        type: "input",
        name: "packageDescription",
        message: "What is the description of this package?",
      },
    ];
  }

  constructor(args: string | string[], options: GeneratorOptions) {
    super(args, options);

    this.loadConfig(
      path.join(__dirname, "../../__fixtures__/config/loadConfigTest.yml")
    );
  }

  public writing() {
    this.writeDestinationJSON("answers.json", this.answers);
  }
}
