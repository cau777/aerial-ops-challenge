import {MutableRefObject} from "react";

/**
 * Generates the public url for an image stored in S3 using its name. It is generated without the S3 SDK to avoid
 * increasing the bundle size.
 * @param image
 */
export const createS3PublicUrl = (image: string) => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${image}`;
}

const Placeholder = "https://unper.ac.id/wp-content/plugins/tutor/assets/images/placeholder-.jpg";

/**
 * Sets the image as a placeholder and waits 3 seconds before trying to fetch the initial image again
 * @param element The target of the onError img event
 * @param refreshesRef
 */
export const scheduleImageRefresh = (element: EventTarget, refreshesRef: MutableRefObject<number>) => {
  if (!(element instanceof HTMLImageElement)) return;
  
  const src = element.src;
  if (src.length === 0 || src === Placeholder) return;
  
  if (refreshesRef.current >= 3) return; // Retry 3 times at most
  refreshesRef.current++;
  
  element.src = Placeholder;
  setTimeout(() => {
    element.src = src;
  }, 3_000);
}