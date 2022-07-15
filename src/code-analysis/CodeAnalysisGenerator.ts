import path from "node:path";

import { BaseGenerator } from "../shared";
import { CodacyGenerator } from "./codacy";
import { CodeClimateGenerator } from "./code-climate";

export class CodeAnalysisGenerator extends BaseGenerator {
  public configureSubGenerators() {
    return [
      {
        Generator: CodacyGenerator,
        path: path.join(__dirname, "./codacy"),
      },
      {
        Generator: CodeClimateGenerator,
        path: path.join(__dirname, "./code-climate"),
      },
    ];
  }
}
