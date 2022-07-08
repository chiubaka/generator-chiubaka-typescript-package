import Generator from "yeoman-generator";

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

  public writeOrAppend(to: string, content: string | Buffer) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (this.fs.exists(to)) {
      return this.fs.append(to, content);
    }

    this.fs.write(to, content);
  }
}
