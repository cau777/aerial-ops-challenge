import React, {FC, FormEvent, useState} from "react";
import {ChatMessageInput} from "../../modules/chatroom/ChatMessageInput";
import {ChatFileInput} from "~/modules/chatroom/ChatFileInput";
import {trpc} from "../../utils/trpc";
import {IconButton} from "../common/IconButton";

export const SendMessageForm: FC = () => {
  const [messageValue, setMessageValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  let {mutateAsync, error, isLoading} = trpc.msg.add.useMutation();
  
  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    
    // Don't send empty messages
    const trimmedMessage = messageValue.trim();
    if (trimmedMessage.length == 0) return;
    
    await mutateAsync({message: trimmedMessage});
  }
  
  return (
    <form onSubmit={submitForm}>
      <div className={"flex bg-back-light-0 shadow p-3 gap-3"}>
        <ChatMessageInput inputValue={messageValue} onInputChange={setMessageValue}/>
        <ChatFileInput setFile={setFile}/>
        <div>
          <IconButton type={"submit"} disabled={false}>Subm</IconButton>
        </div>
      </div>
    </form>
  )
}