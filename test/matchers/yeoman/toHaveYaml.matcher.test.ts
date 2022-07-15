import YeomanTest, { RunResult } from "yeoman-test";

import { EmptyTestGenerator, SimpleYamlTestGenerator } from "../../utils";

describe("toHaveYaml", () => {
  let result: RunResult;

  it("fails if given something other than a YeomanTest.RunResult", () => {
    expect(() => {
      expect(false).toHaveYaml("codecov.yml", { foo: "bar" });
    }).toThrow("Expected false to be a YeomanTest.RunResult");
  });

  describe("when the file does not exist", () => {
    beforeAll(async () => {
      result = await YeomanTest.create(EmptyTestGenerator, {
        namespace: "test:empty",
      }).run();
    });

    it("fails", () => {
      expect(() => {
        expect(result).toHaveYaml("codecov.yml", { foo: "bar" });
      }).toThrow("Expected run result to have a codecov.yml file");
    });
  });

  describe("when the file exists", () => {
    beforeAll(async () => {
      const testYamlFileContents = {
        foo: "bar",
        owner: {
          name: "Jon Smith",
          email: "jon@example.com",
          address: {
            street: "123 Example St",
            city: "Example City",
            country: "Example",
          },
        },
        loadDefaults: false,
        numCustomers: 5,
        colors: ["green", "yellow", "red"],
        // eslint-disable-next-line unicorn/no-null
        nullable: null,
      };

      result = await YeomanTest.create(SimpleYamlTestGenerator, {
        namespace: "test:yaml",
      })
        .withOptions({
          yamlFilePath: "codecov.yaml",
          yamlFileContents: testYamlFileContents,
        })
        .run();
    });

    describe("when the object matches the YAML", () => {
      it("passes for a top-level object key", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", { owner: {} });
        }).not.toThrow();
      });

      it("passes for a top-level array key", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", {
            colors: ["green", "yellow", "red"],
          });
        }).not.toThrow();
      });

      it("passes for a top-level string key", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", {
            foo: "bar",
          });
        }).not.toThrow();
      });

      it("passes for a top-level number key", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", {
            numCustomers: 5,
          });
        }).not.toThrow();
      });

      it("passes for a top-level boolean key", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", {
            loadDefaults: false,
          });
        }).not.toThrow();
      });

      it("passes for a top-level null key", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", {
            // eslint-disable-next-line unicorn/no-null
            nullable: null,
          });
        }).not.toThrow();
      });

      it("passes for a nested object", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", {
            owner: { name: "Jon Smith" },
          });
        }).not.toThrow();
      });

      it("passes for a deeply nested object", () => {
        expect(() => {
          expect(result).toHaveYaml("codecov.yaml", {
            owner: {
              address: {
                street: "123 Example St",
                country: "Example",
              },
            },
          });
        }).not.toThrow();
      });
    });

    describe("when the object does not match the YAML", () => {
      describe("when the matching keys don't exist", () => {
        it("fails for a missing top-level object key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { doesNotExist: {} });
          }).toThrow();
        });

        it("fails for a missing top-level number key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { doesNotExist: 2 });
          }).toThrow();
        });

        it("fails for a missing top-level boolean key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { doesNotExist: false });
          }).toThrow();
        });

        it("fails for a missing top-level null key", () => {
          expect(() => {
            // eslint-disable-next-line unicorn/no-null
            expect(result).toHaveYaml("codecov.yaml", { doesNotExist: null });
          }).toThrow();
        });

        it("fails for a missing nested object key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", {
              owner: { doesNotExist: "foobar" },
            });
          }).toThrow();
        });
      });

      describe("when the matching keys have mismatched values", () => {
        it("fails for a mismatched top-level array key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { colors: [] });
          }).toThrow();
        });

        it("fails for a mismatched top-level string key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { foo: "baz" });
          }).toThrow();
        });

        it("fails for a mismatched top-level number key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { numCustomers: 2 });
          }).toThrow();
        });

        it("fails for a mismatched top-level boolean key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { loadDefaults: true });
          }).toThrow();
        });

        it("fails for a mismatched top-level null key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", { nullable: true });
          }).toThrow();
        });

        it("fails for a mismatched deeply nested object", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", {
              owner: { address: { street: "321 Example St" } },
            });
          }).toThrow();
        });
      });

      describe("when some of the matching keys have mismatched values", () => {
        it("fails for an extra key top-level key", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", {
              foo: "bar",
              colors: ["green", "yellow", "red"],
              doesNotExist: 0,
            });
          }).toThrow();
        });

        it("fails for an extra key on a deeply nested object", () => {
          expect(() => {
            expect(result).toHaveYaml("codecov.yaml", {
              owner: {
                address: {
                  street: "123 Example St",
                  city: "Example City",
                  country: "Example",
                  postalCode: "12345",
                },
              },
            });
          }).toThrow();
        });
      });
    });
  });
});
