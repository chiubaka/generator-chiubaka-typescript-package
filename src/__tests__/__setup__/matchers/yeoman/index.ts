import { toBeYeomanTestRunResult } from "./toBeYeomanTestRunResult.matcher";
import { toHaveDevDependency } from "./toHaveDevDependency.matcher";
import { toHaveDevDependencyComment } from "./toHaveDevDependencyComment.matcher";
import { toHaveDevDependencyWithComment } from "./toHaveDevDependencyWithComment.matcher";
import { toHavePackageJson } from "./toHavePackageJson.matcher";
import { toHaveYaml } from "./toHaveYaml.matcher";

export const yeomanMatchers = {
  toBeYeomanTestRunResult,
  toHaveDevDependency,
  toHaveDevDependencyComment,
  toHaveDevDependencyWithComment,
  toHavePackageJson,
  toHaveYaml,
};
