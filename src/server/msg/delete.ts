import {z} from "zod";
import {Db, ObjectId} from "mongodb";
import {DeleteObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {messagesCollection} from "../utils/collections";
import {rethrowForClient} from "../utils/errors";

export const ZInput = z.object({
  id: z.string()
});

export type ZInput = z.infer<typeof ZInput>;

export const handle = async (input: ZInput, db: Db, storage: S3Client, bucketName: string) => {
  try {
    const result = await messagesCollection(db).findOneAndDelete({
      _id: {$eq: new ObjectId(input.id)}
    }, {});
    
    // If no message with that id was found
    if (result.ok === 0 || result.value === null)
      return;
    
    // Also delete the stored image in S3
    if (result.value.type === "img") {
      const command = new DeleteObjectCommand({
        Key: result.value.image,
        Bucket: bucketName,
      });
      
      await storage.send(command);
    }
  } catch (e) {
    return rethrowForClient(e);
  }
}