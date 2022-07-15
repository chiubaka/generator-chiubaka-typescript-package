import path from "node:path";
import YeomanTest, { RunResult } from "yeoman-test";

import {
  BranchProtectionOptions,
  GitHubApiAdapter,
  GitHubGenerator,
  GitHubGeneratorOptions,
  RepoOptions,
} from "../../../src/github";
import { BaseGenerator } from "../../../src/shared";

const DEFAULT_REPO_OPTIONS = {
  repoOwner: "chiubaka",
  repoName: "generated-typescript-package",
};

describe("GitHubGenerator", () => {
  let gitPushSpy: jest.SpyInstance;

  beforeAll(() => {
    gitPushSpy = jest
      .spyOn(GitHubGenerator.prototype as any, "_gitPush")
      .mockReturnValue(Promise.resolve());
  });

  afterEach(() => {
    gitPushSpy.mockReset();
  });

  afterAll(() => {
    gitPushSpy.mockRestore();
  });

  describe("generator options", () => {
    let repoExistsSpy: jest.SpyInstance;
    let createRepoSpy: jest.SpyInstance;
    let repoOptions: RepoOptions;

    beforeAll(async () => {
      repoExistsSpy = jest
        .spyOn(GitHubApiAdapter.prototype as any, "repoExists")
        .mockResolvedValue(false);
      createRepoSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "createRepo"
      );
      await runGenerator({
        repoOwner: "example-org",
        repoName: "example-repo",
        packageDescription: "Example description",
        isPrivateRepo: true,
      });

      repoOptions = (createRepoSpy.mock.calls[0] as any[])[0] as RepoOptions;
    });

    afterAll(() => {
      repoExistsSpy.mockRestore();
      createRepoSpy.mockRestore();
    });

    it("respects the repoOrganization option", () => {
      expect(repoOptions.owner).toBe("example-org");
    });

    it("respects the repoName option", () => {
      expect(repoOptions.name).toBe("example-repo");
    });

    it("respects the packageDescription option", () => {
      expect(repoOptions.description).toBe("Example description");
    });

    it("respects the isPrivateRepo option", () => {
      expect(repoOptions.isPrivate).toBe(true);
    });
  });

  describe("settings", () => {
    let repoExistsSpy: jest.SpyInstance;
    let createRepoSpy: jest.SpyInstance;
    let updateBranchProtectionSpy: jest.SpyInstance;
    let createCommitSignatureProtectionSpy: jest.SpyInstance;
    let enableVulnerabilityAlertsSpy: jest.SpyInstance;

    let repoOptions: RepoOptions;
    let branchProtectionOptions: BranchProtectionOptions;

    beforeAll(async () => {
      repoExistsSpy = jest
        .spyOn(GitHubApiAdapter.prototype as any, "repoExists")
        .mockResolvedValue(false);
      createRepoSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "createRepo"
      );
      updateBranchProtectionSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "updateBranchProtection"
      );
      createCommitSignatureProtectionSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "createCommitSignatureProtection"
      );
      enableVulnerabilityAlertsSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "enableVulnerabilityAlerts"
      );

      await runGenerator();

      repoOptions = (createRepoSpy.mock.calls[0] as any[])[0] as RepoOptions;
      branchProtectionOptions = (
        updateBranchProtectionSpy.mock.calls[0] as any[]
      )[0] as BranchProtectionOptions;
    });

    afterAll(() => {
      repoExistsSpy.mockRestore();
      createRepoSpy.mockRestore();
      updateBranchProtectionSpy.mockRestore();
      createCommitSignatureProtectionSpy.mockRestore();
      enableVulnerabilityAlertsSpy.mockRestore();
    });

    describe("repo", () => {
      it("enables auto merge", () => {
        expect(repoOptions.allowAutoMerge).toBe(true);
      });

      it("disables merge commits", () => {
        expect(repoOptions.allowMergeCommit).toBe(false);
      });

      it("enables rebase merges", () => {
        expect(repoOptions.allowRebaseMerge).toBe(true);
      });

      it("enables squash merges", () => {
        expect(repoOptions.allowSquashMerge).toBe(true);
      });

      it("enables branch updates", () => {
        expect(repoOptions.allowUpdateBranch).toBe(true);
      });

      it("enables deleting branches after merge", () => {
        expect(repoOptions.deleteBranchOnMerge).toBe(true);
      });

      it("enables issue tracking", () => {
        expect(repoOptions.hasIssues).toBe(true);
      });

      it("enables using squash PR title as default", () => {
        expect(repoOptions.useSquashPrTitleAsDefault).toBe(true);
      });

      it("enables vulnerability alerts", () => {
        expect(enableVulnerabilityAlertsSpy).toHaveBeenLastCalledWith(
          "chiubaka",
          "generated-typescript-package"
        );
      });
    });

    describe("master branch protection", () => {
      it("enables required status checks", () => {
        expect(branchProtectionOptions.requiredStatusChecks).toEqual([
          "codecov/patch",
          "codecov/project",
          "lint-build-test-publish",
        ]);
      });

      it("enables strict status checks", () => {
        expect(branchProtectionOptions.requiredStatusChecksStrict).toBe(true);
      });

      it("requires an approving review count of 0", () => {
        expect(branchProtectionOptions.requiredApprovingReviewCount).toBe(0);
      });

      it("enables requiring a linear history", () => {
        expect(branchProtectionOptions.requiredLinearHistory).toBe(true);
      });

      it("disallows force pushes", () => {
        expect(branchProtectionOptions.allowForcePushes).toBe(false);
      });

      it("disallows deletions", () => {
        expect(branchProtectionOptions.allowDeletions).toBe(false);
      });

      it("requires conversation resolution", () => {
        expect(branchProtectionOptions.requiredConversationResolution).toBe(
          true
        );
      });

      it("disables enforcement of checks for admins", () => {
        expect(branchProtectionOptions.enforceAdmins).toBe(false);
      });

      it("enables commit signature protection", () => {
        expect(createCommitSignatureProtectionSpy).toHaveBeenCalledWith(
          "chiubaka",
          "generated-typescript-package",
          "master"
        );
      });
    });
  });

  describe("repo", () => {
    let repoExistsSpy: jest.SpyInstance;
    let createRepoSpy: jest.SpyInstance;
    let updateRepoSpy: jest.SpyInstance;

    beforeEach(() => {
      repoExistsSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "repoExists"
      );

      createRepoSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "createRepo"
      );
      updateRepoSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "updateRepo"
      );
    });

    afterEach(() => {
      repoExistsSpy.mockRestore();
      createRepoSpy.mockRestore();
      updateRepoSpy.mockRestore();
    });

    describe("when a GitHub repo doesn't already exist", () => {
      beforeEach(() => {
        repoExistsSpy.mockResolvedValue(false);
      });

      it("creates a new GitHub repo if one doesn't already exist", async () => {
        await runGenerator();

        expect(createRepoSpy).toHaveBeenCalled();
        expect(updateRepoSpy).not.toHaveBeenCalled();
      });
    });

    describe("when a GitHub repo already exists", () => {
      beforeEach(() => {
        repoExistsSpy.mockResolvedValue(true);
      });

      it("updates settings of an existing GitHub repo", async () => {
        await runGenerator();

        expect(createRepoSpy).not.toHaveBeenCalled();
        expect(updateRepoSpy).toHaveBeenCalled();
      });
    });
  });

  describe("labels", () => {
    let labelExistsSpy: jest.SpyInstance;
    let createLabelSpy: jest.SpyInstance;
    let updateLabelSpy: jest.SpyInstance;
    let deleteLabelSpy: jest.SpyInstance;

    beforeEach(() => {
      labelExistsSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "labelExists"
      );
      createLabelSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "createLabel"
      );
      updateLabelSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "updateLabel"
      );
      deleteLabelSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "deleteLabel"
      );
    });

    afterEach(() => {
      labelExistsSpy.mockRestore();
      createLabelSpy.mockRestore();
      updateLabelSpy.mockRestore();
      deleteLabelSpy.mockRestore();
    });

    describe("when no labels exist", () => {
      beforeEach(async () => {
        labelExistsSpy.mockResolvedValue(false);
        await runGenerator();
      });

      it("never attempts to update a label", () => {
        expect(updateLabelSpy).not.toHaveBeenCalled();
      });

      describe("creates the full set of labels", () => {
        it("creates a P0 label", () => {
          expect(createLabelSpy).toHaveBeenCalledWith({
            name: ":fire: P0",
            description: "Fire. Drop everything and fix this ASAP.",
            color: "D93F0B",
            ...DEFAULT_REPO_OPTIONS,
          });
        });

        it("creates a bug label", () => {
          expect(createLabelSpy).toHaveBeenCalledWith({
            name: ":bug: bug",
            description: "Something isn't working.",
            color: "D93F0B",
            ...DEFAULT_REPO_OPTIONS,
          });
        });

        it("creates a blocked label", () => {
          expect(createLabelSpy).toHaveBeenCalledWith({
            name: ":no_entry_sign: blocked",
            description:
              "Blocked on something external. Waiting to be unblocked.",
            color: "D93F0B",
            ...DEFAULT_REPO_OPTIONS,
          });
        });
      });
    });

    describe("when all labels exist", () => {
      beforeEach(async () => {
        labelExistsSpy.mockResolvedValue(true);
        await runGenerator();
      });

      it("never attempts to create a label", () => {
        expect(createLabelSpy).not.toHaveBeenCalled();
      });

      describe("deletes default labels", () => {
        it("deletes the default bug label", () => {
          expect(deleteLabelSpy).toHaveBeenCalledWith(
            "chiubaka",
            "generated-typescript-package",
            "bug"
          );
        });

        it("deletes the default enhancement label", () => {
          expect(deleteLabelSpy).toHaveBeenCalledWith(
            "chiubaka",
            "generated-typescript-package",
            "enhancement"
          );
        });
      });

      it("updates the P1 label", () => {
        expect(updateLabelSpy).toHaveBeenCalledWith({
          name: ":triangular_flag_on_post: P1",
          description: "High priority. Resolve in the next few days.",
          color: "FFA500",
          ...DEFAULT_REPO_OPTIONS,
        });
      });

      it("updates the improvement label", () => {
        expect(updateLabelSpy).toHaveBeenCalledWith({
          name: ":muscle: improvement",
          description: "An improvement on something existing.",
          color: "A2EEEF",
          ...DEFAULT_REPO_OPTIONS,
        });
      });

      it("updates the awaiting review label", () => {
        expect(updateLabelSpy).toHaveBeenCalledWith({
          name: ":eyes: awaiting review",
          description: "Requires review before proceeding.",
          color: "FBCA04",
          ...DEFAULT_REPO_OPTIONS,
        });
      });
    });

    describe("when some labels exist and some don't", () => {
      beforeEach(async () => {
        labelExistsSpy.mockImplementation((_repoOwner, _repoName, name) => {
          return Promise.resolve(name === ":warning: P2");
        });
        await runGenerator();
      });

      it("updates the labels that exist", () => {
        expect(updateLabelSpy).toHaveBeenCalledWith({
          name: ":warning: P2",
          description: "Important. Resolve by next release.",
          color: "FBCA04",
          ...DEFAULT_REPO_OPTIONS,
        });
      });

      it("creates the labels that don't exist", () => {
        expect(createLabelSpy).toHaveBeenCalledWith({
          name: ":sparkles: feature",
          description: "New feature or request.",
          color: "5319E7",
          ...DEFAULT_REPO_OPTIONS,
        });
      });
    });
  });

  describe("remote origin", () => {
    describe("when a git remote origin doesn't already exist", () => {
      it("adds the GitHub repo as a git remote origin", async () => {
        const result = await runGenerator();

        const remoteOriginUrl = getRemoteOriginUrl(result);

        expect(remoteOriginUrl).toBe(
          `git@github.com:chiubaka/generated-typescript-package.git`
        );
      });
    });

    describe("when a git remote origin already exists", () => {
      it("updates the remote origin url", async () => {
        const result = await runGenerator({ addRemoteOrigin: true });

        const remoteOriginUrl = getRemoteOriginUrl(result);

        expect(remoteOriginUrl).toBe(
          `git@github.com:chiubaka/generated-typescript-package.git`
        );
      });
    });
  });

  describe("git push", () => {
    let repoExistsSpy: jest.SpyInstance;

    beforeAll(() => {
      repoExistsSpy = jest.spyOn(
        GitHubApiAdapter.prototype as any,
        "repoExists"
      );
    });

    afterAll(() => {
      repoExistsSpy.mockRestore();
    });

    describe("when a GitHub repo doesn't already exist", () => {
      beforeEach(() => {
        repoExistsSpy.mockResolvedValue(false);
      });

      it("creates a new GitHub repo if one doesn't already exist", async () => {
        await runGenerator();

        expect(gitPushSpy).toHaveBeenCalled();
      });
    });

    describe("when a GitHub repo already exists", () => {
      beforeEach(() => {
        repoExistsSpy.mockResolvedValue(true);
      });

      it("updates settings of an existing GitHub repo", async () => {
        await runGenerator();

        expect(gitPushSpy).not.toHaveBeenCalled();
      });
    });
  });
});

const runGenerator = (options: Partial<GitHubTestGeneratorOptions> = {}) => {
  return YeomanTest.create(GitHubTestGenerator, { namespace: "test:github" })
    .withOptions({
      ...options,
    })
    .run();
};

const getRemoteOriginUrl = (result: RunResult) => {
  const commandResult = result.env.spawnCommandSync(
    "git",
    ["config", "--get", "remote.origin.url"],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  return commandResult.stdout;
};

interface GitHubTestGeneratorOptions extends GitHubGeneratorOptions {
  addRemoteOrigin: boolean;
}

class GitHubTestGenerator extends BaseGenerator {
  public configureSubGenerators() {
    return [
      {
        Generator: GitHubGenerator,
        path: path.join(__dirname, "../../../src/github"),
      },
    ];
  }

  public writing() {
    this.spawnCommandSync("git", ["init"]);

    if (this.options.addRemoteOrigin) {
      this.spawnCommandSync("git", [
        "remote",
        "add",
        "origin",
        "git@github.com:chiubaka/test-repo.git",
      ]);
    }
  }
}
