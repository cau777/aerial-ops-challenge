import {z} from "zod";
import {messagesCollection} from "../db";
import {MessageModelWithId} from "../db-models";
import {Db} from "mongodb";

const OrderFlow = z.enum(["asc", "desc"]);
export type OrderFlow = z.infer<typeof OrderFlow>;

const OrderKey = z.enum(["message", "time"]);
export type OrderKey = z.infer<typeof OrderKey>;

export const Input = z.object({
  orderFlow: OrderFlow,
  orderKey: OrderKey,
});

export type Input = z.infer<typeof Input>;

export const handler = async (input: Input, db: Db) => {
  const order = input.orderFlow === "asc" ? 1 : -1;
  let sortingStep;
  switch (input.orderKey) {
    case "message":
      sortingStep = {$sort: {message: order}};
      break
    case "time":
      sortingStep = {$sort: {timestamp: order}};
      break
  }
  
  const result = await messagesCollection(db).aggregate([
    sortingStep // TODO: limit
  ]).toArray();
  
  return result
    .map(o => MessageModelWithId.safeParse(o))
    .map(o => o.success ? o.data : null)
    .filter((o): o is MessageModelWithId => o! !== null)
}