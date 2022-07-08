import assert from "node:assert";
import { Questions } from "yeoman-generator";

import { BaseGenerator } from "../shared";

interface PromptAnswers {
  name: string;
  description: string;
  authorName: string;
  authorEmail: string;
  githubUrl: string;
  keywords?: string;
}

export class NodeModuleGenerator extends BaseGenerator {
  private answers!: PromptAnswers;

  public async prompting() {
    const questions: Questions<PromptAnswers> = [
      {
        type: "input",
        name: "name",
        message: "What is the name of this new package?",
      },
      {
        type: "input",
        name: "description",
        message: "What is the description of this new package?",
      },
      {
        type: "input",
        name: "authorName",
        message: "Who is the author of this new package?",
      },
      {
        type: "input",
        name: "authorEmail",
        message: "What is the email address of the author of this new package?",
      },
      {
        type: "input",
        name: "githubUrl",
        message: "What is the full URL of the GitHub repo for the new package?",
      },
      {
        type: "input",
        name: "keywords",
        message:
          "What keywords would you like to associate with this new package?",
      },
    ];

    this.answers = await this.prompt(questions);
  }

  public writing() {
    assert(this.answers);

    this.writeGitignore();
    this.writePackageJson();
  }

  private writeGitignore() {
    const gitignore = this.readTemplate(".gitignore.ejs");
    this.writeOrAppend(".gitignore", gitignore);
  }

  private writePackageJson() {
    const keywordTokens = this.answers.keywords?.split(" ") || [];
    const keywords = keywordTokens.map((token) => `"${token}"`).join(", ");

    this.copyTemplate("package.json.ejs", "package.json", {
      ...this.answers,
      keywords,
    });
  }
}
