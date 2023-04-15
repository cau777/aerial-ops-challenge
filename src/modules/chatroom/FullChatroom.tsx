'use client'

import {FC, useState} from "react";
import {OrderFlow, OrderKey} from "../../server/list";
import {ChatroomHeader} from "./ChatroomHeader";
import {MessagesFeed} from "./MessagesFeed";
import {SendMessageForm} from "./SendMessageForm";

export const FullChatRoom: FC = () => {
  const [orderKey, setOrderKey] = useState<OrderKey>("time");
  const [orderFlow, setOrderFlow] = useState<OrderFlow>("asc");
  
  return (
    <div className={"container h-full shadow-lg"}>
      <div className={"flex flex-col h-full"}>
        <ChatroomHeader orderKey={orderKey} onKeyChange={setOrderKey} orderFlow={orderFlow} onFlowChange={setOrderFlow}></ChatroomHeader>
        <MessagesFeed orderFlow={orderFlow} orderKey={orderKey}></MessagesFeed>
        <SendMessageForm></SendMessageForm>
      </div>
    </div>
  )
}