import YeomanHelpers, { RunResult } from "yeoman-test";

import {
  DevDependenciesTestGenerator,
  EmptyTestGenerator,
  NoDevDependenciesTestGenerator,
} from "../../../__utils__";

describe("toHaveDevDependencyComment", () => {
  it("fails if given something other than a YeomanTest.RunResult", () => {
    expect(() => {
      expect(2).toHaveDevDependencyComment("node");
    }).toThrow("Expected 2 to be a YeomanTest.RunResult");
  });

  describe("when given a YeomanTest.RunResult", () => {
    let result: RunResult;

    describe("that contains a package.json file with devDependenciesComments", () => {
      beforeAll(async () => {
        result = await YeomanHelpers.create(DevDependenciesTestGenerator, {
          namespace: "test:dev-dependencies",
        }).run();
      });

      it("passes if the package.json lists a comment for the provided devDependency", () => {
        expect(() => {
          expect(result).toHaveDevDependencyComment("typescript");
        }).not.toThrow();
      });

      it("fails if package.json does not list a comment for the provided devDependency", () => {
        expect(() => {
          expect(result).toHaveDevDependencyComment("eslint");
        }).toThrow(
          "Expected run result package.json to have a devDependency comment for eslint"
        );
      });
    });

    describe("that contains a package.json file without devDependencies", () => {
      beforeAll(async () => {
        result = await YeomanHelpers.create(NoDevDependenciesTestGenerator, {
          namespace: "test:no-dev-dependencies",
        }).run();
      });

      it("fails with an error about devDependenciesComments being missing", () => {
        expect(() => {
          expect(result).toHaveDevDependencyComment("typescript");
        }).toThrow(
          "Expected run result package.json to have a devDependenciesComments key"
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
          expect(result).toHaveDevDependencyComment("typescript");
        }).toThrow("Expected run result to contain a package.json file");
      });
    });
  });
});
