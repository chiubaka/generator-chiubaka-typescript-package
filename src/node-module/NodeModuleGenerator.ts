import assert from "node:assert";
import path from "path";
import Generator, { GeneratorOptions } from "yeoman-generator";

interface PromptAnswers {
  packageName: string;
}

export class NodeModuleGenerator extends Generator {
  private answers!: PromptAnswers;

  constructor(args: string | string[], options: GeneratorOptions) {
    super(args, options);
  }

  public async prompting() {
    this.answers = await this.prompt({
      type: "input",
      name: "packageName",
      message: "What's the name of this new package?",
    });
  }

  public writing() {
    assert(this.answers != null);
    console.log(this.answers);
    this.fs.copyTpl(this.templatePath("package.json.ejs"), this.destinationPath("package.json"), { name: this.answers.packageName });
  }
}
