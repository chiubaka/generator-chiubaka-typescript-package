import crypto from "node:crypto";
import path from "node:path";
import tempDirectory from "temp-dir";
import Generator from "yeoman-generator";
import YeomanTest, { RunResult } from "yeoman-test";

import {
  ComposeWithSubGeneratorTestGenerator,
  DestinationRootExecTestGenerator,
  LoadConfigTestGenerator,
  OptionsTestGenerator,
} from "../utils";

describe("BaseGenerator", () => {
  let result: RunResult;

  describe("#loadConfig", () => {
    beforeAll(async () => {
      result = await YeomanTest.create(LoadConfigTestGenerator).run();
    });

    it("loads generator prompt answers from a provided YML file", () => {
      result.assertJsonFileContent("answers.json", {
        packageName: "load-config-test",
        packageDescription: "Loaded description from config",
      });
    });
  });

  describe("#exec", () => {
    let destinationRoot: string;

    beforeAll(async () => {
      destinationRoot = path.join(
        tempDirectory,
        crypto.randomBytes(20).toString("hex")
      );
      result = await YeomanTest.create(DestinationRootExecTestGenerator)
        .withOptions({
          destinationRoot,
        })
        .run();
    });

    // Regression test for https://github.com/chiubaka/generator-chiubaka-typescript-package/issues/132
    it("runs commands in the destinationRoot", () => {
      result.assertFileContent(
        path.join(destinationRoot, "cwd.txt"),
        destinationRoot
      );
    });
  });

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
              yarnInstall: true,
            })
            .run();
        });

        describe("inherits answers from the parent", () => {
          it("writes the child answers to inheritedAnswers.json", () => {
            result.assertJsonFileContent("inheritedAnswers.json", {
              packageName: "test-package",
              packageDescription: "Test package description",
            });
          });

          it("writes parent answers to parentAnswers.json", () => {
            result.assertJsonFileContent("parentAnswers.json", {
              packageName: "test-package",
              packageDescription: "Test package description",
              packageKeywords: "test foo bar",
            });
          });
        });

        describe("inherits options from the parent", () => {
          it("writes the child options to inheritedOptions.json", () => {
            result.assertJsonFileContent("inheritedOptions.json", {
              packageName: "test-package",
              packageDescription: "Test package description",
              packageKeywords: "test foo bar",
              yarnInstall: true,
            });
          });

          it("writes the parent options to inheritedOptions.json", () => {
            result.assertJsonFileContent("parentOptions.json", {
              packageName: "test-package",
              packageDescription: "Test package description",
              packageKeywords: "test foo bar",
              yarnInstall: true,
            });
          });
        });
      });

      describe("when parent is given prompt answers", () => {
        let promptSpy: jest.SpyInstance;

        beforeAll(async () => {
          promptSpy = jest.spyOn(Generator.prototype, "prompt");
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
            .withOptions({
              yarnInstall: true,
            })
            .run();
        });

        it("writes the child answers to inheritedAnswers.json", () => {
          result.assertJsonFileContent("inheritedAnswers.json", {
            packageName: "test-package",
            packageDescription: "Test package description",
          });
        });

        it("writes parent answers to parentAnswers.json", () => {
          result.assertJsonFileContent("parentAnswers.json", {
            packageName: "test-package",
            packageDescription: "Test package description",
            packageKeywords: "test foo bar",
          });
        });

        it("still inherits options", () => {
          result.assertJsonFileContent("inheritedOptions.json", {
            yarnInstall: true,
          });
        });

        it("does not double prompt", () => {
          expect(promptSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("when passed custom options from parent generator", () => {
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
              yarnInstall: true,
            })
            .run();
        });

        it("receives and can work with custom options", () => {
          result.assertJsonFileContent("inheritedOptions.json", {
            customTestOption: "foobar",
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
