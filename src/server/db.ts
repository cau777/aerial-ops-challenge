import {Db, MongoClient, ServerApiVersion} from "mongodb";
import {getEnvVar} from "../utils/env";
import {MessageModel} from "./db-models";

const MONGO_URI = getEnvVar("MONGO_URI");

export const dbClient = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const db = dbClient.db("aerial-ops-challenge-db");
export const messagesCollection = (db: Db) => db.collection<MessageModel>("messages");