import YeomanHelpers, { RunResult } from "yeoman-test";

import {
  DevDependenciesTestGenerator,
  EmptyTestGenerator,
  NoDevDependenciesTestGenerator,
} from "../../utils";

describe("toHaveDevDependency", () => {
  it("fails if given something other than a YeomanTest.RunResult", () => {
    expect(() => {
      expect(2).toHaveDevDependency("node");
    }).toThrow("Expected 2 to be a YeomanTest.RunResult");
  });

  describe("when given a YeomanTest.RunResult", () => {
    let result: RunResult;

    describe("that contains a package.json file with devDependencies", () => {
      beforeAll(async () => {
        result = await YeomanHelpers.create(DevDependenciesTestGenerator, {
          namespace: "test:dev-dependencies",
        }).run();
      });

      describe("and not provided a dependency version", () => {
        it("passes if the package.json lists the provided devDependency", () => {
          expect(() => {
            expect(result).toHaveDevDependency("typescript");
          }).not.toThrow();
        });

        it("fails if the package.json does not list the provided devDependency", () => {
          expect(() => {
            expect(result).toHaveDevDependency("eslint");
          }).toThrow(
            "Expected run result package.json to have devDependency eslint"
          );
        });
      });

      describe("and provided a dependency version", () => {
        it("passes if the package.json in the result has a devDependency with a matching version", () => {
          expect(() => {
            expect(result).toHaveDevDependency("typescript", "4.7.4");
          }).not.toThrow();
        });

        it("fails if the package.json in the result has a matching devDependency but without a matching version", () => {
          expect(() => {
            expect(result).toHaveDevDependency("typescript", "1.0.0");
          }).toThrow(
            "Expected run result package.json to have devDependency typescript with version 1.0.0"
          );
        });

        it("fails if the package.json in the result does not have a matching devDependency", () => {
          expect(() => {
            expect(result).toHaveDevDependency("eslint", "1.0.0");
          }).toThrow(
            "Expected run result package.json to have devDependency eslint with version 1.0.0"
          );
        });
      });
    });

    describe("that contains a package.json file without devDependencies", () => {
      beforeAll(async () => {
        result = await YeomanHelpers.create(NoDevDependenciesTestGenerator, {
          namespace: "test:no-dev-dependencies",
        }).run();
      });

      it("fails with an error about devDependencies being missing", () => {
        expect(() => {
          expect(result).toHaveDevDependency("typescript");
        }).toThrow(
          "Expected run result package.json to have a devDependencies key"
        );
      });
    });

    describe("that does not contain a package.json file", () => {
      beforeAll(async () => {
        result = await YeomanHelpers.create(EmptyTestGenerator, {
          namespace: "test:empty",
        }).run();
      });

      it("fails with an error about package.json being missing", () => {
        expect(() => {
          expect(result).toHaveDevDependency("typescript", "1.0.0");
        }).toThrow("Expected run result to contain a package.json file");
      });
    });
  });
});
