import YeomanHelpers, { RunResult } from "yeoman-test";

describe("JestGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  describe(".gitignore", () => {
    it("ignores the reports directory", () => {
      result.assertFileContent(".gitignore", "reports");
    });

    it("ignores the coverage directory", () => {
      result.assertFileContent(".gitignore", "coverage");
    });

    it("ignores junit.xml", () => {
      result.assertFileContent(".gitignore", "junit.xml");
    });
  });

  describe("package.json", () => {
    describe("installs the necessary devDependencies", () => {
      it("installs jest", () => {
        expect(result).toHaveDevDependencyWithComment("jest");
      });

      it("installs @types/jest", () => {
        expect(result).toHaveDevDependencyWithComment("@types/jest");
      });

      it("installs ts-jest", () => {
        expect(result).toHaveDevDependencyWithComment("ts-jest");
      });

      it("installs jest-junit", () => {
        expect(result).toHaveDevDependencyWithComment("jest-junit");
      });

      it("installs ts-node", () => {
        expect(result).toHaveDevDependencyWithComment("ts-node");
      });

      it("installs @types/node", () => {
        expect(result).toHaveDevDependencyWithComment("@types/node");
      });
    });

    describe("updates the scripts section", () => {
      it("adds a test script", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            test: "jest",
          },
        });
      });

      it("adds a test:ci script", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            "test:ci":
              "yarn run test --ci --runInBand --coverage --reporters=default --reporters=jest-junit",
          },
        });
      });
    });
  });

  it("creates a jest.config.ts file", () => {
    result.assertFile("jest.config.ts");
  });

  it("creates an example test file", () => {
    result.assertFile("src/hello.test.ts");
  });
});
