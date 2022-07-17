import { BaseGenerator } from "../../shared/index";

export class GitHooksGenerator extends BaseGenerator {
  public async writing() {
    await this.writePackageJson();
  }

  public async install() {
    await this.exec("yarn run prepare");

    await this.exec('yarn husky add .husky/pre-commit "yarn run lint:staged"');

    await this.exec('yarn husky add .husky/pre-push "yarn run test"');
  }

  private writePackageJson = async () => {
    const scripts = {
      prepare: "husky install",
    };

    this.extendPackageJson({ scripts });

    await this.addDevDependencyWithComment({
      name: "husky",
      comment: "Modern native Git hooks made easy",
    });
  };
}
