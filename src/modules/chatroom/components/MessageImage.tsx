import {FC, useRef} from "react";
import {scheduleImageRefresh} from "../utils/images";

type Props = {
  src: string;
  alt: string;
}

export const MessageImage: FC<Props> = (props) => {
  const refreshesRef = useRef(0);
  
  return (
    <img onError={e => scheduleImageRefresh(e.target, refreshesRef)} className={"h-[12rem] max-w-full"}
         src={props.src} alt={props.alt}/>
  )
}