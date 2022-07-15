import YeomanHelpers, { RunResult } from "yeoman-test";

import {
  EmptyTestGenerator,
  NoDevDependenciesTestGenerator,
} from "../../utils";

describe("toHavePackageJson", () => {
  it("fails if given something other than a YeomanTest.RunResult", () => {
    expect(() => {
      expect(2).toHavePackageJson();
    }).toThrow("Expected 2 to be a YeomanTest.RunResult");
  });

  describe("when given a YeomanTest.RunResult", () => {
    let result: RunResult;

    describe("that contains a package.json file", () => {
      beforeAll(async () => {
        result = await YeomanHelpers.create(
          NoDevDependenciesTestGenerator
        ).run();
      });

      it("passes", () => {
        expect(() => {
          expect(result).toHavePackageJson();
        }).not.toThrow();
      });
    });

    describe("that does not contain a package.json file", () => {
      beforeAll(async () => {
        result = await YeomanHelpers.create(EmptyTestGenerator).run();
      });

      it("fails", () => {
        expect(() => {
          expect(result).toHavePackageJson();
        }).toThrow();
      });
    });
  });
});
