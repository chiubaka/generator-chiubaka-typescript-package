import { BaseGenerator } from "../shared";

export class GitignoreGenerator extends BaseGenerator {
  public writing() {
    this.copyTemplate(".gitignore.ejs", ".gitignore");
  }
}
