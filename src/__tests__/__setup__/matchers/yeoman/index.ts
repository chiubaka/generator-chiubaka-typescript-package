import { toBeYeomanTestRunResult } from "./toBeYeomanTestRunResult.matcher";
import { toHaveDevDependency } from "./toHaveDevDependency.matcher";
import { toHaveYaml } from "./toHaveYaml.matcher";

export const yeomanMatchers = {
  toBeYeomanTestRunResult,
  toHaveDevDependency,
  toHaveYaml,
};
