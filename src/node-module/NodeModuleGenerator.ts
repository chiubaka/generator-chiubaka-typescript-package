import assert from "node:assert";
import Generator, { GeneratorOptions, Questions } from "yeoman-generator";

interface PromptAnswers {
  name: string;
  description: string;
}

export class NodeModuleGenerator extends Generator {
  private answers!: PromptAnswers;

  constructor(arguments_: string | string[], options: GeneratorOptions) {
    super(arguments_, options);
  }

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
    ];

    this.answers = await this.prompt(questions);
  }

  public writing() {
    assert(this.answers);
    this.fs.copyTpl(
      this.templatePath("package.json.ejs"),
      this.destinationPath("package.json"),
      this.answers
    );
  }
}
