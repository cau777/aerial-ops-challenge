import {z} from "zod";
import {ZMessageModelWithId} from "../models/message.model";
import {Db} from "mongodb";
import {messagesCollection} from "../utils/collections";
import {rethrowForClient} from "../utils/errors";
import {getEnvVar} from "../utils/env";

const OrderFlow = z.enum(["asc", "desc"]);
export type OrderFlow = z.infer<typeof OrderFlow>;

const ZCommon = z.object({
  orderFlow: OrderFlow,
  limit: z.number().default(10),
})

export const ZInput = z.discriminatedUnion("orderKey", [z.object({
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
})]).and(ZCommon);

export type ZInput = z.infer<typeof ZInput>;
export type OrderKey = ZInput["orderKey"];
type Output = Promise<ZMessageModelWithId[]>;

export const handler = async (input: ZInput, db: Db, bucketName: string): Output => {
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
      .map(o => ZMessageModelWithId.safeParse(o))
      .map(o => o.success ? o.data : null)
      .filter((o): o is ZMessageModelWithId => o! !== null)
      // Replaces the relative image path with the url to access it
      .map(o => o.type === "img" ? {...o, image: createS3PublicUrl(o.image, bucketName)} : o);
  } catch (e) {
    return rethrowForClient(e);
  }
}

/**
 * Generates the public url for an image stored in S3 using its name. It is generated without the S3 SDK to avoid
 * increasing the bundle size.
 * @param image
 * @param bucketName
 */
export const createS3PublicUrl = (image: string, bucketName: string) => {
  return `https://${bucketName}.s3.${getEnvVar("AWS_S3_REGION")}.amazonaws.com/${image}`;
}