import Generator, { GeneratorOptions } from "yeoman-generator";

export abstract class BaseGenerator extends Generator {
  constructor(args: string | string[], options: GeneratorOptions) {
    super(args, options);
  }

  public copyTemplate = (
    from: string,
    to: string,
    context?: Record<string, any>
  ) => {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context);
  };
}
