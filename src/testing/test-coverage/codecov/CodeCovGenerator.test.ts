import YeomanHelpers, { RunResult } from "yeoman-test";

describe("CodeCovGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  describe("codecov.yml", () => {
    it("creates a codecov.yml file", () => {
      result.assertFile("codecov.yml");
    });

    it("defines a global coverage target of 80%", () => {
      expect(result).toHaveYaml("codecov.yml", {
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

    it("defines a patch coverage target of 100% with a 5% threshold", () => {
      expect(result).toHaveYaml("codecov.yml", {
        coverage: {
          status: {
            patch: {
              default: {
                target: "100%",
                threshold: "5%",
              },
            },
          },
        },
      });
    });

    it("ignores files in any .yarn directory in the project", () => {
      expect(result).toHaveYaml("codecov.yml", {
        ignore: ["**/.yarn"],
      });
    });
  });
});
