import { RunResult } from "yeoman-test";

export class RunResultUtils {
  public static readPackageJson(runResult: RunResult) {
    const packageJsonString = runResult.fs.read("package.json");
    return JSON.parse(packageJsonString) as Record<string, any>;
  }

  public static write(
    runResult: RunResult,
    to: string,
    contents: string | Buffer
  ): Promise<void> {
    runResult.fs.write(to, contents);
    return this.commit(runResult);
  }

  public static delete(runResult: RunResult, filePath: string): Promise<void> {
    runResult.fs.delete(filePath);
    return this.commit(runResult);
  }

  private static commit(runResult: RunResult): Promise<void> {
    return new Promise((resolve) => {
      runResult.fs.commit(() => {
        resolve();
      });
    });
  }

  public static gitInit(runResult: RunResult) {
    runResult.env.spawnCommandSync("git", ["init"], {});
    this.gitConfigUser(runResult);
  }

  public static gitConfigUser(runResult: RunResult) {
    runResult.env.spawnCommandSync(
      "git",
      ["config", "user.email", "testing@jest.io"],
      {}
    );
    runResult.env.spawnCommandSync("git", ["config", "user.name", "Jest"], {});
  }

  public static gitRestoreStaged(runResult: RunResult) {
    runResult.env.spawnCommandSync("git", ["restore", "--staged", "."], {});
  }
}
