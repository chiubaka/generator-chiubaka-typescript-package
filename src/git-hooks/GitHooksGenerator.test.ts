describe("GitHooksGenerator", () => {
  describe("installs necessary dependencies", () => {
    describe("husky", () => {
      it.todo("adds husky to package.json");

      it.todo("adds a comment describing why husky was installed");

      it.todo("adds a prepare script to install husky in package.json");

      it.todo("adds a .husky/pre-commit file");

      it.todo("adds a .husky/pre-push file");
    });

    describe("lint-staged", () => {
      it.todo("adds lint-staged to package.json");

      it.todo("adds a comment describing why lint-staged was installed");

      it.todo("adds a .lintstagedrc.yml file");

      describe(".lintstagedrc.yml", () => {
        it.todo("runs on edits to .js files");

        it.todo("runs on edits to .jsx files");

        it.todo("runs on edits to .ts files");

        it.todo("runs on edits to .tsx files");

        it.todo("runs on edits to .yml files");

        it.todo("runs on edits to .yaml files");

        it.todo("runs on edits to .json files");

        it.todo("invokes prettier with the --write option");

        it.todo("invokes eslint with the --fix option");
      });
    });

    it.todo("keeps package.json's devDependencies sorted alphabetically");
  });

  describe("creates a working git hooks set up", () => {
    describe("pre-commit", () => {
      it.todo("rejects commits with linting errors that are not auto-fixable");

      it.todo(
        "automatically fixes linting errors in staged files before committing"
      );
    });

    describe("pre-push", () => {
      it.todo("runs tests");

      it.todo("rejects push when tests fail");
    });
  });
});
