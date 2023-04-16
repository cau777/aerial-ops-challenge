import {MongoClient, ServerApiVersion} from "mongodb";
import {getEnvVar} from "./env";

const MONGO_URI = getEnvVar("MONGO_URI");

export const dbClient = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const db = dbClient.db("aerial-ops-challenge-db");