import Generator, { GeneratorOptions } from "yeoman-generator";

export class TypeScriptPackageGenerator extends Generator {
  // private options: TypeScriptPackageGeneratorOptions;

  constructor(args: string | string[], options: GeneratorOptions) {
    super(args, options);
  }

  public initializing() {
    this.composeWith("typescript-package:node-module");
  }
}
