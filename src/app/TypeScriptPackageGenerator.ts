import { BaseGenerator } from "../shared";

export class TypeScriptPackageGenerator extends BaseGenerator {
  public initializing() {
    this.composeWith("typescript-package:node-module");
  }
}
