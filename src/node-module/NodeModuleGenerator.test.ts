import path from "path";
import YeomanHelpers, { RunResult } from "yeoman-test";

import { NodeModuleGenerator } from "./NodeModuleGenerator";

describe("NodeModuleGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(NodeModuleGenerator, {
      resolved: path.join(__dirname, "./NodeModuleGenerator.ts"),
      namespace: "typescript-package:node-module",
    })
      .withPrompts({ packageName: "test-package" })
      .run();
  });

  it("creates a package.json file", () => {
    result.assertFile("package.json");
  });

  it("fills in the name of the package", () => {
    result.assertJsonFileContent("package.json", { name: "test-package" });
  });
});
