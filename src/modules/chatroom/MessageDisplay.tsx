import {FC} from "react";

type Props = {
  message: string;
  imageUrl?: string;
  timestamp: number;
}

const formatTime = (date: Date) => {
  const millis = new Date().getTime() - date.getTime();
  
  const minutes = Math.round(millis / 1_000 / 60);
  if (minutes < 1)
    return "Just now"
  
  if (minutes < 64)
    return minutes + " minutes ago";
  
  if (minutes < 24 * 60)
    return date.toLocaleTimeString();
  
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export const MessageDisplay: FC<Props> = (props) => {
  
  return (
    <div>
      <div className={"mb-1 m-3 inline-block bg-back-light-0 min-w-[12rem] p-3"}>
        {props.message}
      </div>
      <div className={"ms-3 text-xs"}>{formatTime(new Date(props.timestamp))}</div>
    </div>
  )
}