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
    return createResponse();
  }

  public createForAuthenticatedUser(): Promise<Response> {
    return createResponse(201);
  }

  public update(): Promise<Response> {
    return createResponse();
  }

  public updateBranchProtection(): Promise<Response> {
    return createResponse();
  }

  public createCommitSignatureProtection(): Promise<Response> {
    return createResponse();
  }

  public enableVulnerabilityAlerts(): Promise<Response> {
    return createResponse();
  }
}

class Issues {
  public listLabelsForRepo(): Promise<Response<Label[]>> {
    return createResponse(200, []);
  }

  public createLabel(): Promise<Response> {
    return createResponse();
  }

  public updateLabel(): Promise<Response> {
    return createResponse();
  }

  public deleteLabel(): Promise<Response> {
    return createResponse();
  }
}

const createResponse = <T>(status = 200, data?: T): Promise<Response<T>> => {
  return Promise.resolve({
    status,
    data,
  });
};
