import Generator, {
  GeneratorFeatures,
  GeneratorOptions,
  Question,
} from "yeoman-generator";

interface WriteOrAppendOptions {
  leadingNewlineOnAppend?: boolean;
}

interface SubGeneratorCompositionOptions<T> {
  Generator: SubGeneratorConstructor<T>;
  path: string;
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
    features?: GeneratorFeatures,
    questions: Question<T>[] = []
  ) {
    super(args, options, features);

    this.questions = [];
    this.answers = {} as T;

    this.addQuestions(questions);

    this.queueMethod(
      this.initializeQuestions.bind(this),
      "initializeQuestions",
      "initializing"
    );
    this.queueMethod(this.askQuestions.bind(this), "askQuestions", "prompting");
  }

  public composeWithSubGenerator<TSubGeneratorOptions>(
    subGeneratorOptions: SubGeneratorCompositionOptions<TSubGeneratorOptions>
  ): BaseGenerator<TSubGeneratorOptions> {
    const generators = this.composeWithSubGenerators([subGeneratorOptions]);
    return generators[0] as BaseGenerator<TSubGeneratorOptions>;
  }

  public composeWithSubGenerators(
    subGeneratorOptions: SubGeneratorCompositionOptions<any>[]
  ): BaseGenerator<any>[] {
    return super.composeWith(
      subGeneratorOptions,
      this.options,
      true
    ) as BaseGenerator<any>[];
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

  public extendPackageJson(json: Record<string, any>) {
    this.fs.extendJSON(this.destinationPath("package.json"), json);
  }

  public writeOrAppendGitignore(from: string) {
    const content = this.readTemplate(from);
    this.writeOrAppendDestination(".gitignore", content, {
      leadingNewlineOnAppend: true,
    });
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
    const answers = await this.prompt(this.questions);

    this.answers = {
      ...this.answers,
      ...answers,
    };
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
