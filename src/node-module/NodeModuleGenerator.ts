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
  disableImmutableYarnInstalls?: boolean;
}

export class NodeModuleGenerator extends BaseGenerator<NodeModuleGeneratorOptions> {
  public static getQuestions(): Question<NodeModuleGeneratorOptions>[] {
    return [
      ...ReadmeGenerator.getQuestions(),
      {
        type: "input",
        name: "packageKeywords",
        message:
          "What keywords would you like to associate with this new package?",
        default: "generated yeoman typescript",
      },
      {
        type: "input",
        name: "authorName",
        message: "Who is the author of this new package?",
        default: "Daniel Chiu",
      },
      {
        type: "input",
        name: "authorEmail",
        message: "What is the email address of the author of this new package?",
        default: "daniel@chiubaka.com",
      },
    ];
  }

  constructor(
    args: string | string[],
    options: Partial<NodeModuleGeneratorOptions> & GeneratorOptions
  ) {
    super(args, options, { customInstallTask: true });
  }

  public writing() {
    assert(this.answers);

    this.writeGitignore();
    this.writePackageJson();
  }

  public async install() {
    await this.exec("yarn set version 3.2.2");

    let yarnArgs = "install";
    if (this.options.disableImmutableYarnInstalls === true) {
      yarnArgs = `${yarnArgs} --no-immutable`;
    }

    await this.exec(`yarn ${yarnArgs}`);

    await this.exec("yarn dlx @yarnpkg/sdks vscode");
  }

  protected configureSubGenerators = () => {
    return [
      {
        Generator: ReadmeGenerator,
        path: path.join(__dirname, "./readme"),
      },
    ];
  };

  private writeGitignore = () => {
    this.writeOrAppendGitignore(".gitignore.ejs");
  };

  private writePackageJson = () => {
    const keywordTokens = this.answers.packageKeywords?.split(" ") || [];
    const keywords = keywordTokens.map((token) => `"${token}"`).join(", ");

    const githubUrl = `https://github.com/${this.answers.repoOwner}/${this.answers.repoName}`;

    this.copyTemplate("package.json.ejs", "package.json", {
      ...this.answers,
      keywords,
      githubUrl,
    });
  };
}
