import {z} from "zod";
import {generateImgName} from "../utils/images";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {Db} from "mongodb";

export const Input = z.object({
  message: z.string().min(1).max(500),
  // The requirement was to use {hasImage?: boolean} as a field but I think it's better to have an optional object
  // to store the image's properties, this way, we can easily add more metadata to images in the future, location,
  // for example
  image: z.object({
    // The regex pattern guarantees that the string starts with '.'
    formatExtension: z.string().regex(/\..+/),
  }).optional(),
})

export type Input = z.infer<typeof Input>;

export const handler = async (input: Input, db: Db, storage: S3Client, bucketName: string) => {
    // TODO: type safety
    const timestamp = Date.now();
    
    const entry = input.image === undefined
      ? {type: "text", message: input.message, timestamp}
      : {type: "img", message: input.message, timestamp, imgName: generateImgName(input.image.formatExtension)};
    
    await db.collection("messages")
      .insertOne(entry);
    
    if (entry.type === "text")
      return {};
    
    const command = new PutObjectCommand({
      Key: entry.imgName,
      Bucket: bucketName,
    });
    
    const url = await getSignedUrl(storage, command, {
      // Two minutes will give enough time for the client to upload the image, even if the connection is slow
      expiresIn: 120,
    });
    
    return {url};
}