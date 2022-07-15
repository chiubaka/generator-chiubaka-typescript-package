import { matchers } from "../matchers";

// We are actually running full yarn installs in the generated project in tests, and
// that does take some time on CI
const JEST_TIMEOUT = process.env.NODE_ENV !== "test" ? 120_000 : 240_000;

jest.setTimeout(JEST_TIMEOUT);

expect.extend(matchers);
