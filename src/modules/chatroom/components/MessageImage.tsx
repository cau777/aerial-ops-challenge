import {FC, useRef} from "react";
import {createS3PublicUrl, scheduleImageRefresh} from "../utils/images";

type Props = {
  src: string;
  alt: string;
}

export const MessageImage: FC<Props> = (props) => {
  const refreshesRef = useRef(0);
  
  return (
    <img onError={e => scheduleImageRefresh(e.target, refreshesRef)} className={"h-[12rem] max-w-full"}
         src={createS3PublicUrl(props.src)} alt={props.alt}/>
  )
}