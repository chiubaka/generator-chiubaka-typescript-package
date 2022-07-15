import { Question } from "yeoman-generator";

import { BaseGenerator } from "../../../src/shared";

interface OptionsTestGeneratorOptions {
  name: string;
  description: string;
}

export class OptionsTestGenerator extends BaseGenerator<OptionsTestGeneratorOptions> {
  public static getQuestions(): Question<OptionsTestGeneratorOptions>[] {
    return [
      {
        type: "input",
        name: "name",
        message: "Give your test a name",
      },
      {
        type: "input",
        name: "description",
        message: "Give your test a description",
      },
    ];
  }

  public writing() {
    this.writeDestinationJSON("options.json", this.answers);
  }
}
