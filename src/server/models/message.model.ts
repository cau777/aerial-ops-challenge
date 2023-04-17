import {z} from "zod";
import {ObjectId} from "mongodb";

const ZCommonModel = z.object({
  message: z.string().min(1).max(500),
  timestamp: z.number(),
});

export const ZMessageModel = z.discriminatedUnion("type", [z.object({
  type: z.literal("img"),
  image: z.string(),
}), z.object({
  type: z.literal("text"),
})]).and(ZCommonModel);

export type ZMessageModel = z.infer<typeof ZMessageModel>;

const ZId = z.object({_id: z.instanceof(ObjectId)});

export const ZMessageModelWithId = ZMessageModel.and(ZId);
export type ZMessageModelWithId = z.infer<typeof ZMessageModelWithId>;