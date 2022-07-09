import { Question } from "yeoman-generator";

import { BaseGenerator } from "../../shared";

export interface ReadmeGeneratorOptions {
  packageName: string;
  packageDescription: string;
}

export class ReadmeGenerator extends BaseGenerator<ReadmeGeneratorOptions> {
  public static getQuestions(): Question<ReadmeGeneratorOptions>[] {
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

  public write() {
    this.copyTemplate("README.md.ejs", "README.md", {
      packageName: this.answers.packageName,
      packageDescription: this.answers.packageDescription,
    });
  }
}
