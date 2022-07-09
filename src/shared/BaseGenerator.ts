import Generator, {
  GeneratorFeatures,
  GeneratorOptions,
  Question,
} from "yeoman-generator";

interface WriteOrAppendOptions {
  leadingNewlineOnAppend?: boolean;
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
    super(args, options, features);

    this.questions = [];
    this.answers = {} as T;
  }

  public abstract prompting(): void;

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

  protected async askQuestions() {
    const answers = await this.prompt(this.questions);

    this.answers = {
      ...this.answers,
      ...answers,
    };
  }

  protected addQuestions(questions: Question<T>[]) {
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
