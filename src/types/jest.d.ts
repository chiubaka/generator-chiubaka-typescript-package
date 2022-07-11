declare namespace jest {
  interface Matchers {
    toBeYeomanTestRunResult: () => CustomMatcherResult;
    toHaveDevDependency: (
      dependencyName: string,
      dependencyVersion?: string
    ) => CustomMatcherResult;
    toHaveDevDependencyComment: (dependencyName: string) => CustomMatcherResult;
    toHavePackageJson: () => CustomMatcherResult;
    toHaveYaml: <T extends Record<string, any>>(
      filePath: string,
      matchObject: T
    ) => CustomMatcherResult;
  }
}
