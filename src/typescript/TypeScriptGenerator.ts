import path from "node:path";

import { BaseGenerator } from "../shared";
import { TsConfigGenerator } from "./tsconfig";

export class TypeScriptGenerator extends BaseGenerator {
  public async writing() {
    this.copyTemplate("hello.ts", "src/hello.ts");

    await this.addDevDependencies("typescript");
  }

  protected getSubGeneratorOptions() {
    return [
      {
        Generator: TsConfigGenerator,
        path: path.join(__dirname, "./tsconfig"),
      },
    ];
  }
}
