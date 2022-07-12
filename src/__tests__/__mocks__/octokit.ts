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
    return createSuccessResponse();
  }

  public update(): Promise<Response> {
    return createSuccessResponse();
  }

  public updateBranchProtection(): Promise<Response> {
    return createSuccessResponse();
  }

  public createCommitSignatureProtection(): Promise<Response> {
    return createSuccessResponse();
  }

  public enableVulnerabilityAlerts(): Promise<Response> {
    return createSuccessResponse();
  }
}

class Issues {
  public listLabelsForRepo(): Promise<Response<Label[]>> {
    return createSuccessResponse([]);
  }

  public createLabel(): Promise<Response> {
    return createSuccessResponse();
  }

  public updateLabel(): Promise<Response> {
    return createSuccessResponse();
  }
}

const createSuccessResponse = <T>(data?: T): Promise<Response<T>> => {
  return Promise.resolve({
    status: 200,
    data,
  });
};
