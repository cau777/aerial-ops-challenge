import {getEnvVar} from "~/utils/env";

export type ConfigObj = {
  mongoUri: string;
  mongoUsername: string;
  mongoPassword: string;
  s3KeyId: string;
  s3Password: string;
  s3Region: string;
  s3Bucket: string;
}

export function configFromEnv(): ConfigObj {
  return {
    mongoUri: getEnvVar("MONGO_URI"),
    mongoUsername: getEnvVar("MONGO_USERNAME"),
    mongoPassword: getEnvVar("MONGO_PASSWORD"),
    s3Bucket: getEnvVar("AWS_S3_BUCKET"),
    s3KeyId: getEnvVar("AWS_S3_KEY_ID"),
    s3Password: getEnvVar("AWS_S3_SECRET"),
    s3Region: getEnvVar("AWS_S3_REGION"),
  };
}