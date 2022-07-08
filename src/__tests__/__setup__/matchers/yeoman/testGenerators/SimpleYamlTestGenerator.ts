import yaml from "js-yaml";
import assert from "node:assert";
import { GeneratorOptions } from "yeoman-generator";

import { BaseGenerator } from "../../../../../shared";

interface SimpleYamlTestGeneratorOptions extends GeneratorOptions {
  yamlFilePath?: string;
  yamlFileContents?: Record<string, any>;
}

export class SimpleYamlTestGenerator extends BaseGenerator<SimpleYamlTestGeneratorOptions> {
  private yamlFilePath?: string;
  private yamlFileContents?: Record<string, any>;

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
