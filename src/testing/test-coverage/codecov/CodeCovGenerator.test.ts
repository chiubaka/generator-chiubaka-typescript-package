import YeomanHelpers, { RunResult } from "yeoman-test";

describe("CodeCovGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    await YeomanHelpers.create(__dirname).run();
  });

  describe("codecov.yml", () => {
    it("creates a codecov.yml file", () => {
      result.assertFile("codecov.yml");
    });

    it("defines a testing threshold of 80%", () => {
      result.assertJsonFileContent("codecov.yml", {
        coverage: {
          status: {
            project: {
              default: {
                target: "80%",
              },
            },
          },
        },
      });
    });
  });
});
