import YeomanHelpers, { RunResult } from "yeoman-test";

describe("EsLintGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  it("creates a .eslintrc.yml file", () => {
    result.assertFile(".eslintrc.yml");
  });
});
