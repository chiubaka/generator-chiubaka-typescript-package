import { BaseGenerator } from "../../../shared/index";

export class EmptyTestGenerator extends BaseGenerator {
  public prompting() {
    return;
  }

  public writing() {
    return;
  }
}
