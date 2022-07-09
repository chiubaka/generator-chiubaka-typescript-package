import path from "node:path";

import { BaseGenerator } from "../shared";
import { TsConfigGenerator } from "./tsconfig";

export class TypeScriptGenerator extends BaseGenerator {
  public prompting() {
    return;
  }

  public configuring() {
    this.composeWith({
      Generator: TsConfigGenerator,
      path: path.join(__dirname, "./tsconfig"),
    });
  }

  public async writing() {
    this.copyTemplate("hello.ts", "src/hello.ts");

    await this.addDevDependencies("typescript");
  }
}
