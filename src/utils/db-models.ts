import {z} from "zod";

export const MessageModel = z.object({
  _id: z.string(), // TODO: id
  type: z.enum(["text", "img"]),
  message: z.string().min(1).max(500),
  timestamp: z.number(),
  
  image: z.object({
    // The regex pattern guarantees that the string starts with '.'
    formatExtension: z.string().regex(/\..+/),
  }).optional(),
});

export type MessageModel = z.infer<typeof MessageModel>;