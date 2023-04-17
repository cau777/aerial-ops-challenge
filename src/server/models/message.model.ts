import {z} from "zod";
import {ObjectId} from "mongodb";

const CommonModel = z.object({
  message: z.string().min(1).max(500),
  timestamp: z.number(),
});

export const MessageModel = z.discriminatedUnion("type", [z.object({
  type: z.literal("img"),
  image: z.string(),
}), z.object({
  type: z.literal("text"),
})]).and(CommonModel);

export type MessageModel = z.infer<typeof MessageModel>;

const Id = z.object({_id: z.instanceof(ObjectId)});

export const MessageModelWithId = MessageModel.and(Id);
export type MessageModelWithId = z.infer<typeof MessageModelWithId>;