import YeomanTest, { RunResult } from "yeoman-test";

describe("GitGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanTest.create(__dirname)
      .withOptions({ yarnInstall: true })
      .run();
  });

  it("initializes a git repo", () => {
    expect(() => {
      result.env.spawnCommandSync("git", ["status"], {});
    }).not.toThrow();
  });
});
