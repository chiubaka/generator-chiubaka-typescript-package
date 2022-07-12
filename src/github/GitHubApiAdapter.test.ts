jest.unmock("octokit");

import nock from "nock";
import path from "node:path";

import { GitHubApiAdapter } from "./GitHubApiAdapter";

describe("GitHubApiAdapter", () => {
  let github: GitHubApiAdapter;
  const TEST_REPO = {
    owner: "chiubaka",
    name: "test-repo",
    description: "Test generated repo",
    isPrivate: true,
  };
  const TEST_LABEL = {
    repoOwner: "chiubaka",
    repoName: "generated-typescript-package",
    name: "foobar",
    description: "Test description",
    color: "000000",
  };

  beforeAll(() => {
    github = new GitHubApiAdapter();
  });

  afterEach(() => {
    nock.restore();
  });

  describe("#createOrUpdateRepo", () => {
    beforeEach(() => {
      loadGitHubNockScope("createOrUpdateRepo.nock.json");
    });

    it("creates a new repo when one doesn't exist", async () => {
      const response = await github.createOrUpdateRepo(TEST_REPO);

      const { status, data } = response;

      expect(status).toBe(201);
      expect(data.name).toEqual(TEST_REPO.name);
      expect(data.description).toEqual(TEST_REPO.description);
      expect(data.private).toEqual(TEST_REPO.isPrivate);
    });

    it("updates the existing repo when one exists", async () => {
      const response = await github.createOrUpdateRepo({
        ...TEST_REPO,
        description: "Updated description",
        allowAutoMerge: true,
        allowMergeCommit: false,
        allowRebaseMerge: true,
        allowSquashMerge: true,
      });

      const { status, data } = response;

      expect(status).toBe(200);
      expect(data.description).toBe("Updated description");
      expect(data.allow_auto_merge).toBe(true);
      expect(data.allow_merge_commit).toBe(false);
      expect(data.allow_rebase_merge).toBe(true);
      expect(data.allow_squash_merge).toBe(true);
    });
  });

  describe("#createOrUpdateLabel", () => {
    beforeEach(() => {
      loadGitHubNockScope("createOrUpdateLabel.nock.json");
    });

    it("creates a new label when one doesn't exist", async () => {
      const response = await github.createOrUpdateLabel(TEST_LABEL);

      const { status, data } = response;

      expect(status).toBe(201);
      expect(data.name).toBe(TEST_LABEL.name);
      expect(data.description).toBe(TEST_LABEL.description);
      expect(data.color).toBe(TEST_LABEL.color);
    });

    it("updates the existing label when one already exists", async () => {
      const response = await github.createOrUpdateLabel({
        ...TEST_LABEL,
        description: "Updated description",
      });

      const { status, data } = response;

      expect(status).toBe(200);
      expect(data.description).toBe("Updated description");
    });
  });

  describe("#deleteLabel", () => {
    describe("when the label exists", () => {
      beforeEach(() => {
        loadGitHubNockScope("deleteLabel.nock.json");
      });

      it("deletes an existing label", async () => {
        const response = await github.deleteLabel(
          TEST_LABEL.repoOwner,
          TEST_LABEL.repoName,
          TEST_LABEL.name
        );

        expect(response).toBeDefined();

        const { status, data } = response as { status: number; data: never };

        expect(status).toBe(204);
        expect(data).toBeUndefined();
      });
    });

    describe("when the label does not exist", () => {
      beforeEach(() => {
        loadGitHubNockScope("deleteLabelExisting.nock.json");
      });

      it("returns nothing", async () => {
        const response = await github.deleteLabel(
          TEST_LABEL.repoOwner,
          TEST_LABEL.repoName,
          TEST_LABEL.name
        );

        expect(response).toBeUndefined();
      });
    });
  });

  describe("#updateBranchProtection", () => {
    beforeEach(() => {
      loadGitHubNockScope("updateBranchProtection.nock.json");
    });

    it("successfully updates branch protection", async () => {
      const response = await github.updateBranchProtection({
        repoOwner: TEST_REPO.owner,
        repoName: TEST_REPO.name,
        branch: "master",
        requiredLinearHistory: true,
        requiredConversationResolution: true,
      });

      const { status, data } = response;

      expect(status).toBe(200);
      expect(data.required_linear_history).toEqual({ enabled: true });
      expect(data.required_conversation_resolution).toEqual({
        enabled: true,
      });
    });
  });

  describe("#createCommitSignatureProtection", () => {
    beforeEach(() => {
      loadGitHubNockScope("createCommitSignatureProtection.nock.json");
    });

    it("successfully enables commit signature protection", async () => {
      const response = await github.createCommitSignatureProtection(
        TEST_REPO.owner,
        TEST_REPO.name,
        "master"
      );

      const { status, data } = response;

      expect(status).toBe(200);
      expect(data).toEqual({
        enabled: true,
        url: `https://api.github.com/repos/${TEST_REPO.owner}/${TEST_REPO.name}/branches/master/protection/required_signatures`,
      });
    });
  });

  describe("#enableVulnerabilityAlerts", () => {
    beforeEach(() => {
      loadGitHubNockScope("enableVulnerabilityAlerts.nock.json");
    });

    it("successfully enables vulnerability alerts", async () => {
      const response = await github.enableVulnerabilityAlerts(
        TEST_REPO.owner,
        TEST_REPO.name
      );

      const { status, data } = response;

      expect(status).toBe(204);
      expect(data).toBeUndefined();
    });
  });
});

const loadGitHubNockScope = (fileName: string) => {
  nock.load(
    path.join(__dirname, `./__tests__/__fixtures__/nock/github/${fileName}`)
  );
};
