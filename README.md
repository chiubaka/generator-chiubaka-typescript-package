# generator-chiubaka-typescript-package

[![npm](https://img.shields.io/npm/v/generator-chiubaka-typescript-package)](https://www.npmjs.com/package/generator-chiubaka-typescript-package)
[![circleci](https://circleci.com/gh/chiubaka/generator-chiubaka-typescript-package.svg?style=shield)](https://app.circleci.com/pipelines/github/chiubaka/generator-chiubaka-typescript-package?filter=all)
[![codecov](https://codecov.io/gh/chiubaka/generator-chiubaka-typescript-package/branch/master/graph/badge.svg?token=J88MEW7PPZ)](https://codecov.io/gh/chiubaka/generator-chiubaka-typescript-package)
[![Maintainability](https://api.codeclimate.com/v1/badges/07082bec99d8bd4c0b58/maintainability)](https://codeclimate.com/github/chiubaka/generator-chiubaka-typescript-package/maintainability)

Yeoman generator for standard Chiubaka Technologies TypeScript packages for libraries and other such things.

## Motivation
It should be _stupidly_ easy to create a new module/library/package in TypeScript with all of the basic set up to work within the Chiubaka Technologies ecosystem. Removing the activation energy helps to encourage creation of re-usable modules and enforces best practices across the org.

## Creating a new Sub-Generator
All new generators should extend the `BaseGenerator` abstract class. The `BaseGenerator` supplies
some standard structures and common defaults that are used widely within this project.

New sub-generators can be added either within the top-level `src/` directory or as a child
directory of an existing sub-generator.

In the case of a deeply nested sub-generator, make sure that a top-level sub-generator 
composes it.

### Adding Questions
If adding questions to your sub-generator, you can do by creating a `public static getQuestions(): Question<T>[]`
method on your Generator class. This method will get automatically picked up by the `BaseGenerator`
to configure questions and prompts. The `BaseGenerator` will also automatically handle accepting
answers to your questions as either CLI options or prompts.
If composing your generated with an even lower level generator, you must manually include
the questions from the lower level generator in the parent generator. They will not bubble-up automatically.