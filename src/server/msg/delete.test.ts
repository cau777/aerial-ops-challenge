import * as deleteRoute from "./delete";
import {getTestDbClient, getTestStorageClient, testId} from "../utils/testing/test-utils";
import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

const COLLECTION_NAME = "messages";
const EXAMPLE_ITEMS = [
  {type: "text", message: "1", timestamp: 1},
  {type: "text", message: "2", timestamp: 2},
  {type: "text", message: "3", timestamp: 3},
  {type: "text", message: "4", timestamp: 4},
];

describe("delete route", () => {
  const dbName = testId();
  const client = getTestDbClient();
  const db = client.db(dbName, {})
  
  beforeEach(async () => {
    await db.createCollection(COLLECTION_NAME);
  });
  
  it("should delete a text message", async () => {
    // Just create a replacement for the storage client because it shouldn't be used to delete text messages
    const storageClient = {} as S3Client;
    const collection = db.collection(COLLECTION_NAME);
    
    await collection.insertMany(EXAMPLE_ITEMS);
    const anyId = await collection.findOne({});
    
    await deleteRoute.handle({id: anyId!._id.toString()}, db, storageClient, "b");
    const count = await collection.countDocuments({});
    expect(count).toEqual(3);
    
    const found = await collection.findOne({_id: {$eq: anyId!._id}});
    expect(found).toBeNull();
  });
  
  it("should delete an image", async () => {
    const {storageClient, bucketName} = getTestStorageClient();
    const collection = db.collection(COLLECTION_NAME);
    await collection.insertMany(EXAMPLE_ITEMS);
    
    const image = testId() + ".png";
    await storageClient.send(new PutObjectCommand({
      Key: image,
      Bucket: bucketName,
    }))
    await collection.insertOne({type: "img", message: "5", timestamp: 5, image})
    
    const imgId = await collection.findOne({type: "img"});
    await deleteRoute.handle({id: imgId!._id.toString()}, db, storageClient, bucketName);
    const count = await collection.countDocuments({});
    expect(count).toEqual(4);
    
    expect(storageClient.send(new GetObjectCommand({
      Key: image,
      Bucket: bucketName,
    })))
      .rejects
      .toThrow();
  })
  
  afterEach(async () => {
    await db.dropCollection(COLLECTION_NAME);
  });
})