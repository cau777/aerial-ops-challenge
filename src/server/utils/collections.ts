import {Db} from "mongodb";
import {ZMessageModel} from "../models/message.model";

export const messagesCollection = (db: Db) => db.collection<ZMessageModel>("messages");