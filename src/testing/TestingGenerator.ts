import path from "node:path";

import { BaseGenerator } from "../shared";
import { JestGenerator } from "./jest";

export class TestingGenerator extends BaseGenerator {
  public initializing() {
    this.composeWith({
      Generator: JestGenerator,
      path: path.join(__dirname, "./jest"),
    });
  }
}
