import { BaseGenerator } from "../../shared/index";

export class GitHooksGenerator extends BaseGenerator {
  public async writing() {
    await this.writePackageJson();
  }

  public install() {
    if (this.options.yarnInstall === true) {
      this.spawnCommandSync("yarn", ["install"]);
    }

    this.spawnCommandSync("yarn", ["run", "prepare"]);

    this.spawnCommandSync("yarn", [
      "husky",
      "add",
      ".husky/pre-commit",
      '"yarn run lint:staged"',
    ]);

    this.spawnCommandSync("yarn", [
      "husky",
      "add",
      ".husky/pre-push",
      '"yarn run test"',
    ]);
  }

  private async writePackageJson() {
    const scripts = {
      prepare: "husky install",
    };

    this.extendPackageJson({ scripts });

    await this.addDevDependencies("husky");
  }
}
