/** @type {import("next").NextConfig} */
module.exports = {
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  env: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_CERTIFICATE: process.env.MONGO_CERTIFICATE,
    MONGO_USERNAME: process.env.MONGO_USERNAME,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    AWS_S3_KEY_ID: process.env.AWS_S3_KEY_ID,
    AWS_S3_SECRET: process.env.AWS_S3_SECRET,
    AWS_S3_REGION: "us-east-2",
    AWS_S3_BUCKET: "aerial-ops-challenge-images",
  }
};
