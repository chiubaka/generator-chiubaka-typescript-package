import { yeomanRunResultMatchers } from "./yeomanRunResult.matchers";

// Types for matchers must be registered in /test/types/jest.d.ts
export const matchers = {
  ...yeomanRunResultMatchers,
};
