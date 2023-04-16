import {z} from "zod";
import {Db, ObjectId} from "mongodb";
import {DeleteObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {messagesCollection} from "../db";

export const Input = z.object({
  id: z.string()
});

export type Input = z.infer<typeof Input>;

export const handle = async (input: Input, db: Db, storage: S3Client, bucketName: string) => {
  const result = await messagesCollection(db).findOneAndDelete({
    _id: {$eq: new ObjectId(input.id)}
  }, {});
  
  if (result.ok === 0 || result.value === null)
    throw new Error("Message not found");
  
  // Also delete the stored image in S3
  if (result.value.type === "img") {
    const command = new DeleteObjectCommand({
      Key: result.value.image,
      Bucket: bucketName,
    });
    
    await storage.send(command);
  }
}