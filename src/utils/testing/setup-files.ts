import {MongoClient} from "mongodb";
import {testId} from "./test-utils";

// Nanoid requires a bunch of workarounds to work with jest, so it's better to just mock it
jest.mock("nanoid", () => ({
  nanoid: testId,
}));

let testDbClient: MongoClient | null = null;

export const getTestDbClient = () => {
  if (testDbClient === null)
      testDbClient = new MongoClient("mongodb://test:test@localhost:27017");
  return testDbClient;
}

global.afterAll(async () => {
  if (testDbClient !== null)
    await testDbClient.close();
});