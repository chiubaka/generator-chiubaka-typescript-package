import YeomanTest, { RunResult } from "yeoman-test";

import { OptionsTestGenerator } from "../__tests__/__utils__";

describe("BaseGenerator", () => {
  describe("OptionsTestGenerator", () => {
    let result: RunResult;

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
