import path from "node:path";

import { BaseGenerator } from "../shared";
import { TsConfigGenerator } from "./tsconfig";

export class TypeScriptGenerator extends BaseGenerator {
  public configuring() {
    this.composeWith({
      Generator: TsConfigGenerator,
      path: path.join(__dirname, "./tsconfig"),
    });
  }

  public async writing() {
    await this.addDevDependencies("typescript");
  }
}
