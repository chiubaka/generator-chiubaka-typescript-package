import path from "node:path";

import { BaseGenerator } from "../shared";
import { JestGenerator } from "./jest";
import { TestCoverageGenerator } from "./test-coverage";

export class TestingGenerator extends BaseGenerator {
  public initializing() {
    this.composeWithSubGenerators([
      {
        Generator: JestGenerator,
        path: path.join(__dirname, "./jest"),
      },
      {
        Generator: TestCoverageGenerator,
        path: path.join(__dirname, "./test-coverage"),
      },
    ]);
  }
}
