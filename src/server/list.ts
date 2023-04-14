import {z} from "zod";
import {db} from "~/utils/db";

export const Input = z.object({
  orderFlow: z.enum(["asc", "desc"]),
  orderKey: z.enum(["message", "time"]),
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
    ]);
  console.log(result)
  return result;
}