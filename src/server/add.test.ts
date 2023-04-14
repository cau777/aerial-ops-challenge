import * as addRoute from "./add";
import {getTestDbClient} from "../utils/setup-files";
import {S3Client} from "@aws-sdk/client-s3";
import {testId} from "../utils/test-utils";

const COLLECTION_NAME = "messages";
describe("add route", () => {
  const dbName = testId();
  const client = getTestDbClient();
  const db = client.db(dbName, {})
  
  beforeEach(async () => {
    await db.createCollection(COLLECTION_NAME);
  });
  
  it('should add text messages', async () => {
    // Just create a replacement for the storage client because it shouldn't be used to add text messages
    const storageClient = {} as S3Client;
    
    await addRoute.handler({message: "1"}, db, storageClient, "");
    await addRoute.handler({message: "2"}, db, storageClient, "");
    await addRoute.handler({message: "3"}, db, storageClient, "");
    await addRoute.handler({message: "4"}, db, storageClient, "");
    const count = await db.collection(COLLECTION_NAME).countDocuments();
    expect(count).toEqual(4);
  });
  
  it('should add images and return valid uris', async () => {
    const storageClient = {} as S3Client; // TODO: test
  
    await addRoute.handler({message: "1", image: {formatExtension: ".png"}}, db, storageClient, "b");
    await addRoute.handler({message: "2", image: {formatExtension: ".png"}}, db, storageClient, "b");
    await addRoute.handler({message: "3", image: {formatExtension: ".png"}}, db, storageClient, "b");
    await addRoute.handler({message: "4", image: {formatExtension: ".png"}}, db, storageClient, "b");
  });
  
  afterEach(async () => {
    await db.dropCollection(COLLECTION_NAME);
  })
})

export {};