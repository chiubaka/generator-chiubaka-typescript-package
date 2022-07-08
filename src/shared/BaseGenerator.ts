import Generator from "yeoman-generator";

interface WriteOrAppendOptions {
  leadingNewlineOnAppend?: boolean;
}

export abstract class BaseGenerator extends Generator {
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
