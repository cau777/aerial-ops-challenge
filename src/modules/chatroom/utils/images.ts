import {nanoid} from "nanoid";

export const generateImgName = (extension: string) => (
  nanoid(16) + extension
)

/**
 * Generates the public url for an image stored in S3 using its name. It is generated without the S3 SDK to avoid
 * increasing the bundle size.
 * @param image
 */
export const createS3PublicUrl = (image: string) => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${image}`;
}

const Retries = new Map<string, number>(); // TODO:
const Placeholder = "https://unper.ac.id/wp-content/plugins/tutor/assets/images/placeholder-.jpg"; // TODO: upload

/**
 * Sets the image as a placeholder and waits 2 seconds before trying to fetch the initial image again
 * @param element The target of the onError img event
 */
export const scheduleImageRefresh = (element: EventTarget) => {
  if (!(element instanceof HTMLImageElement)) return;
  
  const src = element.src;
  if (src.length === 0 || src === Placeholder) return;
  
  const prev = Retries.get(src) ?? 0;
  if (prev >= 5) return; // Retry 5 times at most
  Retries.set(src, prev + 1);
  
  element.src = Placeholder;
  setTimeout(() => {
    element.src = src;
  }, 2_000);
}