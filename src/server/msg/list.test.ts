import * as listRoute from "./list";
import {getTestDbClient, testId} from "../utils/testing/test-utils";
import {ZMessageModel} from "../models/message.model";

const COLLECTION_NAME = "messages";
const EXAMPLE_ITEMS = [
  {type: "text", message: "1", timestamp: 1},
  {type: "text", message: "2", timestamp: 2},
  {type: "text", message: "3", timestamp: 3},
  {type: "text", message: "4", timestamp: 4},
];
describe("list route", () => {
  const dbName = testId();
  const client = getTestDbClient();
  const db = client.db(dbName, {})
  
  beforeEach(async () => {
    await db.createCollection(COLLECTION_NAME);
  });
  
  it('should get all elements at once', async () => {
    await db.collection(COLLECTION_NAME).insertMany(EXAMPLE_ITEMS);
    const result = await listRoute.handler({orderKey: "time", limit: 10, orderFlow: "asc", cursor: {}}, db);
    expect(result.length).toEqual(4);
    expect(new Set(result.map(o => o.timestamp)).size).toEqual(4); // Check duplicates
  });
  
  it('should get elements paginated', async () => {
    await db.collection(COLLECTION_NAME).insertMany(EXAMPLE_ITEMS);
    let last: undefined | number = undefined;
    const result: number[] = []
    
    for (let i = 0; i < 4; i++) {
      const page: ZMessageModel[] = await listRoute.handler({orderKey: "time", limit: 1, orderFlow: "asc", cursor: {max: last}}, db);
      expect(page.length).toEqual(1);
      last = page[0].timestamp;
      result.push(page[0].timestamp);
    }
    
    expect(result.length).toEqual(4);
    expect(new Set(result).size).toEqual(4); // Check duplicates
  });
  
  afterEach(async () => {
    await db.dropCollection(COLLECTION_NAME);
  });
})