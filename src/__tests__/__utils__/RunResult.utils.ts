import { RunResult } from "yeoman-test";

export class RunResultUtils {
  public static write(
    runResult: RunResult,
    to: string,
    contents: string | Buffer
  ): Promise<void> {
    runResult.fs.write(to, contents);
    return new Promise((resolve) => {
      runResult.fs.commit(() => {
        resolve();
      });
    });
  }
}
