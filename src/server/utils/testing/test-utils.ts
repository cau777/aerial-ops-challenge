import {MongoClient} from "mongodb";
import {S3Client} from "@aws-sdk/client-s3";

/**
 * Generates a very simple and PROBABLY unique numeric identifier.
 * Should only be used in testing because it's not as safe as libraries like nanoid()
 */
export const testId = () => Math.random().toString().replace(".", "");

let testDbClient: MongoClient | null = null;

/**
 * Returns a client for a database listening on localhost:27017, with credentials test:test
 */
export const getTestDbClient = () => {
  if (testDbClient === null)
    testDbClient = new MongoClient("mongodb://test:test@localhost:27017");
  return testDbClient;
}

global.afterAll(async () => {
  if (testDbClient !== null)
    await testDbClient.close();
});

export const getTestStorageClient = () => {
  return {
    storageClient: new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_TEST_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_TEST_SECRET!,
      }
    }),
  
    bucketName: process.env.AWS_S3_TEST_BUCKET!,
  }
}