import { ErrorUtils, ExecException } from "../../../src/shared/";

describe("ErrorUtils", () => {
  describe(".isExecException", () => {
    const exception: ExecException = {
      name: "Test name",
      message: "Test message",
      code: "test code",
      cmd: "test cmd",
      killed: true,
      signal: 1,
      stdout: "test stdout",
      stderr: "test stderr",
    };

    it("returns true when given an error with all the correct properties", () => {
      const result = ErrorUtils.isExecException(exception);

      expect(result).toBe(true);
    });

    it("returns true when given an ExecException with null signal", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        // eslint-disable-next-line unicorn/no-null
        signal: null,
      });

      expect(result).toBe(true);
    });

    it("returns false if error has no name property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        name: undefined,
      });

      expect(result).toBe(false);
    });

    it("returns false if error has no message property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        message: undefined,
      });

      expect(result).toBe(false);
    });

    it("returns false if error has no cmd property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        cmd: undefined,
      });

      expect(result).toBe(false);
    });

    it("returns false if error has no killed property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        killed: undefined,
      });

      expect(result).toBe(false);
    });

    it("returns false if error has no code property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        code: undefined,
      });

      expect(result).toBe(false);
    });

    it("returns false if error has no signal property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        signal: undefined,
      });

      expect(result).toBe(false);
    });

    it("returns false if error has no stdout property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        stdout: undefined,
      });

      expect(result).toBe(false);
    });

    it("returns false if error has no stderr property", () => {
      const result = ErrorUtils.isExecException({
        ...exception,
        stderr: undefined,
      });

      expect(result).toBe(false);
    });
  });
});
