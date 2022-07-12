interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  description: string | null;
  color: string;
  default: boolean;
}

interface Response<T = any> {
  status: number;
  data?: T;
}

export class Octokit {
  public rest: Rest;

  constructor() {
    this.rest = new Rest();
  }
}

class Rest {
  public repos: Repos;
  public issues: Issues;

  constructor() {
    this.repos = new Repos();
    this.issues = new Issues();
  }
}

class Repos {
  public get(): Promise<any> {
    return Promise.resolve({});
  }

  public createForAuthenticatedUser(): Promise<Response> {
    return Promise.resolve({
      status: 200,
    });
  }

  public update(): Promise<Response> {
    return Promise.resolve({
      status: 200,
    });
  }
}

class Issues {
  public listLabelsForRepo(): Promise<Response<Label[]>> {
    return Promise.resolve({
      status: 200,
      data: [],
    });
  }

  public createLabel(): Promise<Response> {
    return Promise.resolve({
      status: 200,
    });
  }

  public updateLabel(): Promise<Response> {
    return Promise.resolve({
      status: 200,
    });
  }
}
