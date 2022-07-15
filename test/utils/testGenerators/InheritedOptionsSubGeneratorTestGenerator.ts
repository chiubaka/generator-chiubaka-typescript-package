import { Question } from "yeoman-generator";

import { BaseGenerator } from "../../../src/shared";

export interface InheritedOptionsSubGeneratorTestGeneratorOptions {
  packageName: string;
  packageDescription: string;
}

export class InheritedOptionsSubGeneratorTestGenerator extends BaseGenerator<InheritedOptionsSubGeneratorTestGeneratorOptions> {
  public static getQuestions(): Question<InheritedOptionsSubGeneratorTestGeneratorOptions>[] {
    return [
      {
        type: "input",
        name: "packageName",
        message: "What is the name of this new package?",
      },
      {
        type: "input",
        name: "packageDescription",
        message: "What is the description of this new package?",
      },
    ];
  }

  public writing() {
    const options = { ...this.options };
    delete options.env;

    this.writeDestinationJSON("inheritedAnswers.json", this.answers);
    this.writeDestinationJSON("inheritedOptions.json", options);
  }
}

export default InheritedOptionsSubGeneratorTestGenerator;
