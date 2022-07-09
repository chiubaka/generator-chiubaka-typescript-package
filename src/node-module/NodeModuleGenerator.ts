import assert from "node:assert";
import path from "node:path";
import { GeneratorOptions, Question } from "yeoman-generator";

import { BaseGenerator } from "../shared";
import { ReadmeGenerator } from "./readme";
import { ReadmeGeneratorOptions } from "./readme/ReadmeGenerator";

export interface NodeModuleGeneratorOptions extends ReadmeGeneratorOptions {
  packageKeywords: string;
  authorName: string;
  authorEmail: string;
  githubUrl: string;
}

export class NodeModuleGenerator extends BaseGenerator<NodeModuleGeneratorOptions> {
  public static QUESTIONS: Question<NodeModuleGeneratorOptions>[] = [
    ...ReadmeGenerator.QUESTIONS,
    {
      type: "input",
      name: "packageKeywords",
      message:
        "What keywords would you like to associate with this new package?",
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
  ];

  constructor(
    args: string | string[],
    options: Partial<NodeModuleGeneratorOptions> & GeneratorOptions
  ) {
    super(args, options, { customInstallTask: true });
  }

  public initializing() {
    this.composeWith(
      {
        Generator: ReadmeGenerator,
        path: path.join("./readme"),
      },
      this.options
    );

    this.addQuestions(NodeModuleGenerator.QUESTIONS);
  }

  public async prompting() {
    await this.askQuestions();
  }

  public writing() {
    assert(this.answers);

    this.writeGitignore();
    this.writePackageJson();
  }

  private writeGitignore() {
    this.writeOrAppendGitignore(".gitignore.ejs");
  }

  private writePackageJson() {
    const keywordTokens = this.answers.packageKeywords?.split(" ") || [];
    const keywords = keywordTokens.map((token) => `"${token}"`).join(", ");

    this.copyTemplate("package.json.ejs", "package.json", {
      ...this.answers,
      keywords,
    });
  }

  public install() {
    this.spawnCommandSync("yarn", ["set", "version", "3.2.1"]);
  }
}
