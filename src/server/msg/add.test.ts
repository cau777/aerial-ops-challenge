import * as addRoute from "./add";
import {DeleteObjectCommand, GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getTestDbClient, getTestStorageClient, testId} from "../utils/testing/test-utils";

const COLLECTION_NAME = "messages";
const IMAGE_SIZE = 4;
describe("add route", () => {
  jest.setTimeout(20_000);
  
  const dbName = testId();
  const client = getTestDbClient();
  const db = client.db(dbName, {})
  
  beforeEach(async () => {
    await db.createCollection(COLLECTION_NAME);
  });
  
  it("should add text messages", async () => {
    // Just create a replacement for the storage client because it shouldn't be used to add text messages
    const storageClient = {} as S3Client;
    
    await addRoute.handler({message: "1"}, db, storageClient, "b");
    await addRoute.handler({message: "2"}, db, storageClient, "b");
    await addRoute.handler({message: "3"}, db, storageClient, "b");
    await addRoute.handler({message: "4"}, db, storageClient, "b");
    
    const count = await db.collection(COLLECTION_NAME).countDocuments();
    expect(count).toEqual(4);
  });
  
  it("should add images and return valid uris", async () => {
   const {storageClient, bucketName} = getTestStorageClient();
   
    const urls = [];
    for (let i = 0; i < 2; i++) {
      urls.push(await addRoute.handler({message: i.toString(), image: {formatExtension: ".png", size: IMAGE_SIZE}}, db, storageClient, bucketName));
    }
    
    const count = await db.collection(COLLECTION_NAME).countDocuments();
    expect(count).toEqual(2);
  
    for (let url of urls) {
      await fetch(url.imageUrl!, {method: "PUT", body: new ArrayBuffer(IMAGE_SIZE)});
    }
    
    const keys = await db.collection(COLLECTION_NAME).find({}).toArray();
    for (let dbElement of keys) {
      // Asserts it's there
      await storageClient.send(new GetObjectCommand({
        Key: dbElement.image,
        Bucket: bucketName,
      }));
  
      // And delete it
      await storageClient.send(new DeleteObjectCommand({
        Key: dbElement.image,
        Bucket: bucketName,
      }));
    }
  });
  
  afterEach(async () => {
    await db.dropCollection(COLLECTION_NAME);
  });
})
