import {S3Client} from "@aws-sdk/client-s3";
import {getEnvVar} from "./env";

const AWS_S3_REGION = getEnvVar("AWS_S3_REGION");
const AWS_S3_KEY_ID = getEnvVar("AWS_S3_KEY_ID");
const AWS_S3_SECRET = getEnvVar("AWS_S3_SECRET");
export const BUCKET_NAME = getEnvVar("AWS_S3_BUCKET");

export const storageClient = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_S3_KEY_ID,
    secretAccessKey: AWS_S3_SECRET,
  }
});
