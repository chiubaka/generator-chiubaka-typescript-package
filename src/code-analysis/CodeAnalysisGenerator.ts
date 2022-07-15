import path from "node:path";

import { BaseGenerator } from "../shared";
import { CodacyGenerator } from "./codacy";

export class CodeAnalysisGenerator extends BaseGenerator {
  public configureSubGenerators() {
    return [
      {
        Generator: CodacyGenerator,
        path: path.join(__dirname, "./codacy"),
      },
    ];
  }
}
