import { Question } from "yeoman-generator";

import { BaseGenerator } from "../../shared";

export interface ReadmeGeneratorOptions {
  packageName: string;
  packageDescription: string;
}

export class ReadmeGenerator extends BaseGenerator<ReadmeGeneratorOptions> {
  public static QUESTIONS: Question<ReadmeGeneratorOptions>[] = [
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

  public initializing() {
    this.addQuestions(ReadmeGenerator.QUESTIONS);
  }

  public async prompting() {
    await this.askQuestions();
  }

  public write() {
    this.copyTemplate("README.md.ejs", "README.md", {
      packageName: this.answers.packageName,
      packageDescription: this.answers.packageDescription,
    });
  }
}
