import YeomanHelpers, { RunResult } from "yeoman-test";

import { RunResultUtils } from "./RunResult.utils";
import {
  DevDependenciesTestGenerator,
  EmptyTestGenerator,
} from "./testGenerators";

describe("RunResultUtils", () => {
  let result: RunResult;

  describe("when package.json doesn't exist", () => {
    beforeAll(async () => {
      result = await YeomanHelpers.create(EmptyTestGenerator).run();
    });

    describe(".readPackageJson", () => {
      it("throws an error when package.json doesn't exist", () => {
        expect(() => {
          RunResultUtils.readPackageJson(result);
        }).toThrow("package.json doesn't exist");
      });
    });
  });

  describe("when package.json exists", () => {
    beforeAll(async () => {
      result = await YeomanHelpers.create(DevDependenciesTestGenerator).run();
    });

    describe(".readPackageJson", () => {
      it("returns the contents of package.json", () => {
        const json = RunResultUtils.readPackageJson(result);

        expect(json).toEqual({
          devDependencies: {
            typescript: "4.7.4",
          },
          devDependenciesComments: {
            typescript: "TypeScript support for this project",
          },
        });
      });
    });

    describe(".write", () => {
      afterEach(async () => {
        await RunResultUtils.delete(result, "test.txt");
      });

      it("writes the provided contents to the provided path", async () => {
        await RunResultUtils.write(result, "test.txt", "Hello, world!");

        result.assertFileContent("test.txt", "Hello, world!");
      });
    });

    describe(".delete", () => {
      it("deletes the specified file", async () => {
        await RunResultUtils.write(result, "test.txt", "Hello, world!");

        result.assertFile("test.txt");

        await RunResultUtils.delete(result, "test.txt");

        result.assertNoFile("test.txt");
      });
    });

    describe(".gitInit", () => {
      beforeAll(() => {
        RunResultUtils.gitInit(result);
      });

      it("initializes an new git repository", () => {
        expect(() => {
          result.env.spawnCommandSync("git", ["status"], {});
        }).not.toThrow();
      });
    });

    describe(".gitConfigUser", () => {
      describe("sets the user for the git repository", () => {
        it("sets the user's email address", () => {
          const commandResult = result.env.spawnCommandSync(
            "git",
            ["config", "user.email"],
            { stdio: ["ignore", "pipe", "pipe"] }
          );
          const gitUserEmail = commandResult.stdout;

          expect(gitUserEmail).toBe("testing@jest.io");
        });

        it("sets the user's name", () => {
          const commandResult = result.env.spawnCommandSync(
            "git",
            ["config", "user.name"],
            { stdio: ["ignore", "pipe", "pipe"] }
          );
          const gitUserEmail = commandResult.stdout;

          expect(gitUserEmail).toBe("Jest");
        });
      });
    });

    describe(".gitRestoreStaged", () => {
      it("clears all staged files for the git repository", () => {
        result.env.spawnCommandSync(
          "git",
          ["commit", "--allow-empty", "-m", "Initial commit"],
          {}
        );
        result.env.spawnCommandSync("git", ["add", "package.json"], {});

        RunResultUtils.gitRestoreStaged(result);

        const commandResult = result.env.spawnCommandSync(
          "git",
          ["diff", "--staged", "--quiet"],
          { stdio: ["ignore", "pipe", "pipe"] }
        );

        const gitStatus = commandResult.stdout;

        expect(gitStatus).toBe("");
      });
    });
  });
});
