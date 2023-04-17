import {z} from "zod";
import {MessageModelWithId} from "../models/message.model";
import {Db} from "mongodb";
import {messagesCollection} from "../utils/collections";
import {rethrowForClient} from "../utils/errors";

const OrderFlow = z.enum(["asc", "desc"]);
export type OrderFlow = z.infer<typeof OrderFlow>;

const Common = z.object({
  orderFlow: OrderFlow,
  limit: z.number().default(10),
})

export const Input = z.discriminatedUnion("orderKey", [z.object({
  orderKey: z.literal("message"),
  cursor: z.object({
    min: z.string().optional(),
    max: z.string().optional(),
  }).default({}),
}), z.object({
  orderKey: z.literal("time"),
  cursor: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).default({}),
})]).and(Common);

export type Input = z.infer<typeof Input>;
export type OrderKey = Input["orderKey"];
type Output = Promise<MessageModelWithId[]>;

export const handler = async (input: Input, db: Db): Output => {
  try {
    // -1 means the sorting is reversed
    // This seems to be inverted, but we are browsing the list from the bottom
    const order = input.orderFlow === "asc" ? -1 : 1;
    const query = await messagesCollection(db).find();
    
    switch (input.orderKey) {
      case "message":
        if (input.cursor.min !== undefined)
          query.filter({message: {$gt: input.cursor.min}})
        if (input.cursor.max !== undefined)
          query.filter({message: {$lt: input.cursor.max}});
        
        // This makes sorting case-insensitive
        query.collation({locale: "en"});
        query.sort({message: order});
        break
      case "time":
        if (input.cursor.min)
          query.filter({timestamp: {$gt: input.cursor.min}});
        if (input.cursor.max)
          query.filter({timestamp: {$lt: input.cursor.max}});
        
        query.sort({timestamp: order});
        break
    }
    query.limit(input.limit);
    
    const result = await query.toArray();
    
    // Ignore records that don't match the zod schema
    return result
      .map(o => MessageModelWithId.safeParse(o))
      .map(o => o.success ? o.data : null)
      .filter((o): o is MessageModelWithId => o! !== null);
  } catch (e) {
    return rethrowForClient(e);
  }
}