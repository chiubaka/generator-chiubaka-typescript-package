import yaml from "js-yaml";
import { exec as nodeExec } from "node:child_process";
import util from "node:util";
import Generator, {
  GeneratorFeatures,
  GeneratorOptions,
  Question,
} from "yeoman-generator";

import { ErrorUtils } from "./utils";

const exec = util.promisify(nodeExec);

interface DependencyDefinition {
  name: string;
  comment: string;
  version?: string;
}

interface WriteOrAppendOptions {
  leadingNewlineOnAppend?: boolean;
}

export interface SubGeneratorCompositionConfig<T> {
  Generator: SubGeneratorConstructor<T>;
  path: string;
  options?: Partial<T>;
}

interface SubGeneratorConstructor<T> {
  new (
    args: string[],
    options: Partial<T> & GeneratorOptions,
    features?: GeneratorFeatures
  ): BaseGenerator<T>;
  getQuestions?: () => Question<T>[];
}

export abstract class BaseGenerator<
  T extends Record<string, any> = Record<string, any>
> extends Generator<Partial<T> & GeneratorOptions> {
  protected answers: T;

  private questions: Question<T>[];

  constructor(
    args: string | string[],
    options: Partial<T> & GeneratorOptions,
    features?: GeneratorFeatures
  ) {
    super(args, options, {
      customInstallTask: true,
      ...features,
    });

    this.questions = [];
    this.answers = {} as T;

    this.queueMethod(
      this.initializeQuestions.bind(this),
      "initializeQuestions",
      "initializing"
    );
    this.queueMethod(this.askQuestions.bind(this), "askQuestions", "prompting");
    this.queueMethod(
      this.initializeSubGenerators.bind(this),
      "initializeSubGenerators",
      "default"
    );
  }

  /**
   * @deprecated Use BaseGenerator#composeWithSubGenerator instead.
   * @param _generators
   * @param _options
   * @param _returnNewGenerator
   */
  public composeWith(
    generators: any,
    options?: any,
    returnNewGenerator?: any
  ): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return super.composeWith(generators, options, returnNewGenerator);
  }

  public copyTemplate = (
    from: string,
    to: string,
    context?: Record<string, any>
  ) => {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context);
  };

  public async addDevDependencyWithComment(dependency: DependencyDefinition) {
    return this.addDevDependenciesWithComments([dependency]);
  }

  public async addDevDependenciesWithComments(
    dependencies: DependencyDefinition[]
  ) {
    const dependenciesWithVersions: Record<string, string> = {};
    const dependenciesWithoutVersions: string[] = [];
    const dependencyComments: Record<string, string> = {};

    for (const { name, comment, version } of dependencies) {
      if (version) {
        // eslint-disable-next-line security/detect-object-injection
        dependenciesWithVersions[name] = version;
      } else {
        dependenciesWithoutVersions.push(name);
      }
      // eslint-disable-next-line security/detect-object-injection
      dependencyComments[name] = comment;
    }

    this.extendPackageJson({ devDependenciesComments: dependencyComments });

    await super.addDevDependencies(dependenciesWithVersions);
    await super.addDevDependencies(dependenciesWithoutVersions);
  }

  /**
   * @deprecated Use BaseGenerator#addDevDependencyWithComment instead.
   * @param dependencies
   * @returns a promise of a map of dependencies and versions installed
   */
  public addDevDependencies(
    dependencies: string | string[] | Record<string, string>
  ) {
    return super.addDevDependencies(dependencies);
  }

  public extendPackageJson(json: Record<string, any>) {
    this.fs.extendJSON(this.destinationPath("package.json"), json);
  }

  public writeOrAppendGitignore(from: string) {
    const content = this.readTemplate(from);
    this.writeOrAppendDestination(".gitignore", content, {
      leadingNewlineOnAppend: true,
    });
  }

  protected loadConfig(configFilePath: string) {
    const configContents = this.fs.read(configFilePath);
    const config = yaml.load(configContents) as T;

    this.options = {
      ...this.options,
      ...config,
    };
  }

  protected configureSubGenerators(): SubGeneratorCompositionConfig<any>[] {
    return [];
  }

  protected async exec(command: string) {
    try {
      const result = await exec(command, { cwd: this.destinationRoot() });
      return result;
    } catch (error: any) {
      if (ErrorUtils.isExecException(error)) {
        throw {
          ...error,
          message: `${error.message}\n${error.stdout}\n${error.stderr}`,
        };
      }

      throw error;
    }
  }

  /**
   * Initializes questions based on optionally provided `getQuestions` static method
   */
  private initializeQuestions() {
    const getQuestions = (
      this.constructor as unknown as { getQuestions?: () => Question<T>[] }
    ).getQuestions;

    const questions = getQuestions !== undefined ? getQuestions() : [];

    this.addQuestions(questions);
  }

  private async askQuestions() {
    const answers =
      this.questions.length > 0 ? await this.prompt(this.questions) : {};

    this.answers = {
      ...this.answers,
      ...answers,
    };
  }

  private initializeSubGenerators() {
    const subGenerators = this.configureSubGenerators();
    this.composeWithSubGenerators(subGenerators);
  }

  private addQuestions(questions: Question<T>[]) {
    for (const question of questions) {
      this.addQuestionOrCopyOption(question);
    }
  }

  private addQuestionOrCopyOption(question: Question<T>) {
    const name = question.name as string;
    // eslint-disable-next-line security/detect-object-injection
    const option = this.options[name] as unknown;

    if (option === undefined) {
      this.questions.push(question);
    } else {
      // eslint-disable-next-line security/detect-object-injection
      (this.answers as Record<string, any>)[name] = option;
    }
  }

  private composeWithSubGenerators(
    subGenerators: SubGeneratorCompositionConfig<any>[]
  ): BaseGenerator<any>[] {
    return subGenerators.map((subGenerator) => {
      return super.composeWith(
        {
          Generator: subGenerator.Generator,
          path: subGenerator.path,
        },
        {
          ...this.options,
          ...this.answers,
          ...subGenerator.options,
        },
        true
      ) as BaseGenerator<any>;
    });
  }

  private writeOrAppendDestination(
    to: string,
    content: string,
    options: WriteOrAppendOptions = {}
  ) {
    this.writeOrAppend(this.destinationPath(to), content, options);
  }

  private writeOrAppend(
    to: string,
    content: string,
    options: WriteOrAppendOptions = {}
  ) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (this.fs.exists(to)) {
      if (options.leadingNewlineOnAppend === true) {
        content = `\n${content}`;
      }

      return this.fs.append(to, content);
    }

    this.fs.write(to, content);
  }
}
