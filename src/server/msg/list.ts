import {z} from "zod";
import {MessageModelWithId} from "../models/message.model";
import {Db} from "mongodb";
import {messagesCollection} from "../utils/collections";

const OrderFlow = z.enum(["asc", "desc"]);
export type OrderFlow = z.infer<typeof OrderFlow>;

const Common = z.object({
    orderFlow: OrderFlow,
    limit: z.number().default(10),
})

export const Input = z.discriminatedUnion("orderKey", [z.object({
  orderKey: z.literal("message"),
  cursor: z.string().optional(),
}), z.object({
  orderKey: z.literal("time"),
  cursor: z.number().optional(),
})]).and(Common);

export type Input = z.infer<typeof Input>;
export type OrderKey = Input["orderKey"];
type Output = Promise<MessageModelWithId[]>;

export const handler = async (input: Input, db: Db): Output => {
  const order = input.orderFlow === "asc" ? -1 : 1;
  
  const innerCursorFilter = input.orderFlow === "asc" ? {$lt: input.cursor} : {$gt: input.cursor};
  const query = await messagesCollection(db).find();
  
  switch (input.orderKey) {
    case "message":
      if (input.cursor !== undefined)
        query.filter({message: innerCursorFilter});
      // This makes sorting case-insensitive
      query.collation({locale: "en"});
      query.sort({message: order});
      break
    case "time":
      if (input.cursor !== undefined)
        query.filter({timestamp: innerCursorFilter});
      query.sort({timestamp: order});
      break
  }
  query.limit(input.limit);
  
  const result = await query.toArray();
  return result
    .map(o => MessageModelWithId.safeParse(o))
    .map(o => o.success ? o.data : null)
    .filter((o): o is MessageModelWithId => o! !== null)
}