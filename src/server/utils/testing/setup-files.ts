import {testId} from "./test-utils";

// Nanoid requires a bunch of workarounds to work with jest, so it's better to just mock it
// https://github.com/ai/nanoid/issues/363
jest.mock("nanoid", () => ({
  nanoid: testId,
}));