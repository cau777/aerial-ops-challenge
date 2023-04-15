import {z} from "zod";
import {db} from "~/utils/db";

const OrderFlow = z.enum(["asc", "desc"]);
export type OrderFlow = z.infer<typeof OrderFlow>;

const OrderKey = z.enum(["message", "time"]);
export type OrderKey = z.infer<typeof OrderKey>;

export const Input = z.object({
  orderFlow: OrderFlow,
  orderKey: OrderKey,
});

export type Input = z.infer<typeof Input>;

export const handler = async (input: Input) => {
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
  
  const result = await db.collection("messages")
    .aggregate([
      sortingStep // TODO: limit
    ])
    .toArray();
  console.log(result)
  return result;
}