import { BaseGenerator } from "../shared";

export class GitignoreGenerator extends BaseGenerator {
  public prompting() {
    return;
  }

  public writing() {
    this.copyTemplate(".gitignore.ejs", ".gitignore");
  }
}
