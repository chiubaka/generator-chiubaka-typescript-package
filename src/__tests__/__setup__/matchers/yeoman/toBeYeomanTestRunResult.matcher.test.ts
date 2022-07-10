import YeomanTest, { RunResult } from "yeoman-test";

import { EmptyTestGenerator } from "../../../__utils__";

describe("toBeYeomanTestRunResult", () => {
  describe("when given something that isn't a YeomanTest.RunResult", () => {
    it("fails on a number", () => {
      expect(() => {
        expect(2).toBeYeomanTestRunResult();
      }).toThrow("Expected 2 to be a YeomanTest.RunResult");
    });

    it("fails on a boolean", () => {
      expect(() => {
        expect(true).toBeYeomanTestRunResult();
      }).toThrow("Expected true to be a YeomanTest.RunResult");
    });

    it("fails on a string", () => {
      expect(() => {
        expect("foobar").toBeYeomanTestRunResult();
      }).toThrow("Expected foobar to be a YeomanTest.RunResult");
    });

    it("fails on an empty object", () => {
      expect(() => {
        expect({}).toBeYeomanTestRunResult();
      }).toThrow("Expected [object Object] to be a YeomanTest.RunResult");
    });

    it("fails on a function", () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const nullOp = () => {
        return;
      };

      expect(() => {
        expect(nullOp).toBeYeomanTestRunResult();
      }).toThrow(`Expected ${nullOp.toString()} to be a YeomanTest.RunResult`);
    });
  });

  describe("when given a YeomanTest.RunResult", () => {
    let result: RunResult;

    beforeAll(async () => {
      result = await YeomanTest.create(EmptyTestGenerator, {
        namespace: "test:empty",
      }).run();
    });

    it("passes", () => {
      expect(() => {
        expect(result).toBeYeomanTestRunResult();
      }).not.toThrow();
    });
  });

  // Ultimately we rely on certain functions in a RunResult, so so long as those
  // exist, it doesn't matter if it's not a "real" RunResult
  it("passes on an object that looks like a YeomanTest.RunResult", () => {
    const mockRunResult = {
      assertFile: jest.fn(),
      assertNoFile: jest.fn(),
      assertFileContent: jest.fn(),
      assertEqualsFileContent: jest.fn(),
      assertNoFileContent: jest.fn(),
      assertTextEqual: jest.fn(),
      assertObjectContent: jest.fn(),
      assertNoObjectContent: jest.fn(),
      assertJsonFileContent: jest.fn(),
      assertNoJsonFileContent: jest.fn(),

      env: {},
      fs: {},
    };

    expect(() => {
      expect(mockRunResult).toBeYeomanTestRunResult();
    }).not.toThrow();
  });
});
