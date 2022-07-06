declare namespace jest {
  interface Matchers {
    toHaveDevDependency: (
      dependencyName: string,
      dependencyVersion: string
    ) => CustomMatcherResult;
  }
}
