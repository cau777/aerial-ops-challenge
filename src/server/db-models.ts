import {z} from "zod";
import {ObjectId} from "mongodb";

const CommonModel = {
  message: z.string().min(1).max(500),
  timestamp: z.number(),
};

export const MessageModel = z.discriminatedUnion("type", [z.object({
  type: z.literal("img"),
  image: z.string(),
  ...CommonModel,
}), z.object({
  type: z.literal("text"),
  ...CommonModel,
})]);

export type MessageModel = z.infer<typeof MessageModel>;

const Id = z.object({_id: z.instanceof(ObjectId)});

export const MessageModelWithId = MessageModel.and(Id);
export type MessageModelWithId = z.infer<typeof MessageModelWithId>;