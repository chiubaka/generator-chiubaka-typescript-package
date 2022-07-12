import YeomanTest from "yeoman-test";

import { GitHubApiAdapter, RepoOptions } from "./GitHubApiAdapter";

const DEFAULT_REPO_OPTIONS = {
  repoOwner: "chiubaka",
  repoName: "generated-typescript-package",
};

describe("GitHubGenerator", () => {
  describe("options", () => {
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
      await YeomanTest.create(__dirname)
        .withOptions({
          repoOrganization: "example-org",
          repoName: "example-repo",
          packageDescription: "Example description",
          isPrivateRepo: true,
        })
        .run();

      repoOptions = (createRepoSpy.mock.calls[0] as any[])[0] as RepoOptions;
    });

    afterAll(() => {
      repoExistsSpy.mockReset();
      createRepoSpy.mockReset();
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
      repoExistsSpy.mockReset();
      createRepoSpy.mockReset();
      updateRepoSpy.mockReset();
    });

    describe("when a GitHub repo doesn't already exist", () => {
      beforeEach(() => {
        repoExistsSpy.mockResolvedValue(false);
      });

      it("creates a new GitHub repo if one doesn't already exist", async () => {
        await YeomanTest.create(__dirname).run();

        expect(createRepoSpy).toHaveBeenCalled();
        expect(updateRepoSpy).not.toHaveBeenCalled();
      });
    });

    describe("when a GitHub repo already exists", () => {
      beforeEach(() => {
        repoExistsSpy.mockResolvedValue(true);
      });

      it("updates settings of an existing GitHub repo", async () => {
        await YeomanTest.create(__dirname).run();

        expect(createRepoSpy).not.toHaveBeenCalled();
        expect(updateRepoSpy).toHaveBeenCalled();
      });
    });
  });

  describe("labels", () => {
    let labelExistsSpy: jest.SpyInstance;
    let createLabelSpy: jest.SpyInstance;
    let updateLabelSpy: jest.SpyInstance;

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
    });

    afterEach(() => {
      labelExistsSpy.mockReset();
      createLabelSpy.mockReset();
      updateLabelSpy.mockReset();
    });

    describe("when no labels exist", () => {
      beforeEach(async () => {
        labelExistsSpy.mockResolvedValue(false);
        await YeomanTest.create(__dirname).run();
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
        await YeomanTest.create(__dirname).run();
      });

      it("never attempts to create a label", () => {
        expect(createLabelSpy).not.toHaveBeenCalled();
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
        await YeomanTest.create(__dirname).run();
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
});
