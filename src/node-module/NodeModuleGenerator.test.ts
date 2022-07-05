import path from "node:path";
import YeomanHelpers, { RunResult } from "yeoman-test";

import { NodeModuleGenerator } from "./NodeModuleGenerator";

describe("NodeModuleGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(NodeModuleGenerator, {
      resolved: path.join(__dirname, "./NodeModuleGenerator.ts"),
      namespace: "typescript-package:node-module",
    })
      .withPrompts({
        name: "test-package",
        description: "This is a test package generated by Yeoman.",
        authorName: "Jon Smith",
        authorEmail: "jon@example.com",
      })
      .run();
  });

  describe("package.json", () => {
    it("creates a package.json file", () => {
      result.assertFile("package.json");
    });

    it("fills in the name of the package", () => {
      result.assertJsonFileContent("package.json", { name: "test-package" });
    });

    it("fills in the version of the package", () => {
      result.assertJsonFileContent("package.json", { version: "0.0.1" });
    });

    it("fills in the description of the package", () => {
      result.assertJsonFileContent("package.json", {
        description: "This is a test package generated by Yeoman.",
      });
    });

    it("fills in the author of the package", () => {
      result.assertJsonFileContent("package.json", {
        author: `Jon Smith <jon@example.com>`,
      });
    });

    it("fills in the license of the package", () => {
      result.assertJsonFileContent("package.json", {
        license: "UNLICENSED",
      });
    });
  });
});
