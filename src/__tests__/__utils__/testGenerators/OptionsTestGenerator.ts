import { BaseGenerator } from "../../../shared";

interface OptionsTestGeneratorOptions {
  name: string;
  description: string;
}

export class OptionsTestGenerator extends BaseGenerator<OptionsTestGeneratorOptions> {
  public initializing() {
    this.addQuestions([
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
    ]);
  }

  public async prompting() {
    await this.askQuestions();
  }

  public writing() {
    this.writeDestinationJSON("options.json", this.answers);
  }
}
