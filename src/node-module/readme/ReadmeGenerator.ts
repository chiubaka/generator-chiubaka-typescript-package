import { Question } from "yeoman-generator";

import { BaseGenerator } from "../../shared";

export interface ReadmeGeneratorOptions {
  repoOrganization: string;
  packageName: string;
  packageDescription: string;
  includeNpmShield: boolean;
  includeCircleCiShield: boolean;
}

export class ReadmeGenerator extends BaseGenerator<ReadmeGeneratorOptions> {
  public static getQuestions(): Question<ReadmeGeneratorOptions>[] {
    return [
      {
        type: "input",
        name: "repoOrganization",
        message: "What organization does this repository belong to?",
        default: "chiubaka",
      },
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
      {
        type: "confirm",
        name: "includeNpmShield",
        message: "Would you like to include an NPM shield in the README?",
        default: false,
      },
      {
        type: "confirm",
        name: "includeCircleCiShield",
        message: "Would you like to include a CircleCI shield in the README?",
        default: false,
      },
    ];
  }

  public writing() {
    this.copyTemplate("README.md.ejs", "README.md", this.answers);
  }
}
