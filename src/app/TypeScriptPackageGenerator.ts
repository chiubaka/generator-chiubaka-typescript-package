import path from "node:path";

import { GitignoreGenerator } from "../gitignore";
import { NodeModuleGenerator } from "../node-module";
import { BaseGenerator } from "../shared";

export class TypeScriptPackageGenerator extends BaseGenerator {
  public initializing() {
    this.composeWith([
      {
        Generator: NodeModuleGenerator,
        path: path.join(__dirname, "../node-module"),
      },
      {
        Generator: GitignoreGenerator,
        path: path.join(__dirname, "../gitignore"),
      },
    ]);
  }
}
