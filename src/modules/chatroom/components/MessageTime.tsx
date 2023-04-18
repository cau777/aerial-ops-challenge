'use client'
// This MUST be a client only component to avoid issues where client text content does not match server-rendered HTML

import {FC} from "react";
import {formatTime} from "../utils/formatting";

type Props = {
  timestamp: number;
}

export const MessageTime: FC<Props> = (props) => {
  return (
    <div className={"ms-3 text-xs"}>{formatTime(new Date(props.timestamp))}</div>
  )
}