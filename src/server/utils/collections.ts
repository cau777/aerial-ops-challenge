import {Db} from "mongodb";
import {MessageModel} from "../models/message.model";

export const messagesCollection = (db: Db) => db.collection<MessageModel>("messages");