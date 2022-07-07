import { matchers } from "./matchers";

expect.extend(matchers);

jest.setTimeout(10_000);
