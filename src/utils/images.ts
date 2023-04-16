import {nanoid} from "nanoid";

export const generateImgName = (extension: string) => (
  nanoid(16) + extension
)

export const readImagePath = (file: File | null) => {
  if (file === null)
    return Promise.resolve(null);
  
  return new Promise<string | null>((res) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result as string);
      reader.readAsDataURL(file);
    } catch (e) {
      res(null);
    }
  })
}

/**
 * The public url is generated without the s3 SDK to avoid increasing the bundle size
 * @param image
 */
export const createS3PublicUrl = (image: string) => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${image}`;
}

const Retries = new Map<string, number>();
const Placeholder = "https://unper.ac.id/wp-content/plugins/tutor/assets/images/placeholder-.jpg";
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