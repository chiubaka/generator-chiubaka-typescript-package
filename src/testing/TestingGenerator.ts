import path from "node:path";

import { BaseGenerator } from "../shared";
import { JestGenerator } from "./jest";
import { TestCoverageGenerator } from "./test-coverage";

export class TestingGenerator extends BaseGenerator {
  public initializing() {
    this.composeWith({
      Generator: JestGenerator,
      path: path.join(__dirname, "./jest"),
    });

    this.composeWith({
      Generator: TestCoverageGenerator,
      path: path.join(__dirname, "./test-coverage"),
    });
  }

  public prompting() {
    return;
  }
}
