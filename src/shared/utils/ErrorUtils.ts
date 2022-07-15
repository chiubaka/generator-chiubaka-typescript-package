export interface ExecException extends Error {
  code: string;
  killed: boolean;
  signal: number | null;
  cmd: string;
  stdout: string;
  stderr: string;
}

export class ErrorUtils {
  public static isExecException(error: any): error is ExecException {
    const execException = error as ExecException;

    return (
      execException.name !== undefined &&
      execException.message !== undefined &&
      execException.cmd !== undefined &&
      execException.killed !== undefined &&
      execException.code !== undefined &&
      execException.signal !== undefined &&
      execException.stdout !== undefined &&
      execException.stderr !== undefined
    );
  }
}
