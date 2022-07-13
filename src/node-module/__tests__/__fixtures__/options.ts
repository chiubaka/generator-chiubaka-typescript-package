import { NodeModuleGeneratorOptions } from "../../NodeModuleGenerator";
import { README_GENERATOR_TEST_OPTIONS } from "../../readme/__tests__/__fixtures__";

export const NODE_MODULE_GENERATOR_TEST_OPTIONS: NodeModuleGeneratorOptions = {
  ...README_GENERATOR_TEST_OPTIONS,
  packageKeywords: "test chiubaka-technologies",
  authorName: "Jon Smith",
  authorEmail: "jon@example.com",
  repoName: "generated-typescript-package",
};
