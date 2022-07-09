import YeomanTest, { RunResult } from "yeoman-test";

import { OptionsTestGenerator } from "../__tests__/__utils__";
import { ComposeWithSubGeneratorTestGenerator } from "../__tests__/__utils__";

describe("BaseGenerator", () => {
  let result: RunResult;

  describe("#composeWithSubGenerator", () => {
    describe("subgenerator", () => {
      describe("when parent is given options", () => {
        beforeAll(async () => {
          result = await YeomanTest.create(
            ComposeWithSubGeneratorTestGenerator,
            {
              namespace: "test:compose-with-sub-generator",
            }
          )
            .withOptions({
              packageName: "test-package",
              packageDescription: "Test package description",
              packageKeywords: "test foo bar",
            })
            .run();
        });

        describe("inherits options from the parent", () => {
          it("writes the child options to inheritedOptions.json", () => {
            result.assertJsonFileContent("inheritedOptions.json", {
              packageName: "test-package",
              packageDescription: "Test package description",
            });
          });

          it("writes parent options to parentOptions.json", () => {
            result.assertJsonFileContent("parentOptions.json", {
              packageName: "test-package",
              packageDescription: "Test package description",
              packageKeywords: "test foo bar",
            });
          });
        });
      });

      describe("when parent is given prompt answers", () => {
        beforeAll(async () => {
          result = await YeomanTest.create(
            ComposeWithSubGeneratorTestGenerator,
            {
              namespace: "test:compose-with-sub-generator",
            }
          )
            .withPrompts({
              packageName: "test-package",
              packageDescription: "Test package description",
              packageKeywords: "test foo bar",
            })
            .run();
        });

        it("writes the child options to inheritedOptions.json", () => {
          result.assertJsonFileContent("inheritedOptions.json", {
            packageName: "test-package",
            packageDescription: "Test package description",
          });
        });

        it("writes parent options to parentOptions.json", () => {
          result.assertJsonFileContent("parentOptions.json", {
            packageName: "test-package",
            packageDescription: "Test package description",
            packageKeywords: "test foo bar",
          });
        });
      });
    });
  });

  describe("interchangeably accepts options or prompt answers", () => {
    describe("when given options", () => {
      beforeAll(async () => {
        result = await YeomanTest.create(OptionsTestGenerator, {
          namespace: "test:options",
        })
          .withOptions({ name: "test", description: "a simple test" })
          .run();
      });

      describe("writes options to options.json", () => {
        it("creates an options.json file", () => {
          result.assertFile("options.json");
        });

        it("writes all options to options.json", () => {
          result.assertJsonFileContent("options.json", {
            name: "test",
            description: "a simple test",
          });
        });
      });
    });

    describe("when given prompt answers", () => {
      beforeAll(async () => {
        result = await YeomanTest.create(OptionsTestGenerator, {
          namespace: "test:options",
        })
          .withPrompts({ name: "test", description: "a simple test" })
          .run();
      });

      describe("writes answers to options.json", () => {
        it("creates an options.json file", () => {
          result.assertFile("options.json");
        });

        it("writes all answers to options.json", () => {
          result.assertJsonFileContent("options.json", {
            name: "test",
            description: "a simple test",
          });
        });
      });
    });

    describe("when given a mix of options and prompt answers", () => {
      beforeAll(async () => {
        result = await YeomanTest.create(OptionsTestGenerator, {
          namespace: "test:options",
        })
          .withOptions({ name: "test" })
          .withPrompts({ description: "a simple test" })
          .run();
      });

      describe("writes options and answers to options.json", () => {
        it("creates an options.json file", () => {
          result.assertFile("options.json");
        });

        it("writes all options and answers to options.json", () => {
          result.assertJsonFileContent("options.json", {
            name: "test",
            description: "a simple test",
          });
        });
      });
    });
  });
});
