import yaml from "js-yaml";
import assert from "node:assert";
import { Question } from "yeoman-generator";

import { BaseGenerator } from "../../../src/shared";

interface SimpleYamlTestGeneratorOptions {
  yamlFilePath: string;
  yamlFileContents: Record<string, any>;
}

export class SimpleYamlTestGenerator extends BaseGenerator<SimpleYamlTestGeneratorOptions> {
  private yamlFilePath?: string;
  private yamlFileContents?: Record<string, any>;

  public static getQuestions(): Question<SimpleYamlTestGeneratorOptions>[] {
    return [
      {
        type: "input",
        name: "yamlFilePath",
        message: "Path to the YAML file to output",
      },
      {
        type: "input",
        name: "yamlFileContents",
        message: "Contents to write to the YAML file",
      },
    ];
  }

  constructor(
    args: string | string[],
    options: SimpleYamlTestGeneratorOptions
  ) {
    super(args, options);

    this.yamlFilePath = options.yamlFilePath;
    this.yamlFileContents = options.yamlFileContents;
  }

  public writing() {
    assert(this.yamlFilePath !== undefined);
    assert(this.yamlFileContents !== undefined);

    const contents = yaml.dump(this.yamlFileContents);
    this.writeDestination(this.yamlFilePath, contents);
  }
}
