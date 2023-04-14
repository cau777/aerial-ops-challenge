import {nanoid} from "nanoid";

export const generateImgName = (extension: string) => (
  nanoid(16) + extension
)