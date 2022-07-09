import path from "node:path";
import { Question } from "yeoman-generator";

import { BaseGenerator } from "../../../shared";
import {
  InheritedOptionsSubGeneratorTestGenerator,
  InheritedOptionsSubGeneratorTestGeneratorOptions,
} from "./InheritedOptionsSubGeneratorTestGenerator";

interface ComposeWithSubGeneratorTestGeneratorOptions
  extends InheritedOptionsSubGeneratorTestGeneratorOptions {
  packageKeywords: string;
}

export class ComposeWithSubGeneratorTestGenerator extends BaseGenerator<ComposeWithSubGeneratorTestGenerator> {
  public static getQuestions(): Question<ComposeWithSubGeneratorTestGeneratorOptions>[] {
    return [
      ...InheritedOptionsSubGeneratorTestGenerator.getQuestions(),
      {
        type: "input",
        name: "packageKeywords",
        message: "What keywords would you like to associate with this package?",
      },
    ] as Question<ComposeWithSubGeneratorTestGeneratorOptions>[];
  }

  public initializing() {
    this.composeWithSubGenerator({
      Generator: InheritedOptionsSubGeneratorTestGenerator,
      path: path.join(__dirname, "./InheritedOptionsSubGeneratorTestGenerator"),
    });
  }

  public writing() {
    this.writeDestinationJSON("parentOptions.json", this.answers);
  }
}
