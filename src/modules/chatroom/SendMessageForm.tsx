import React, {FC, FormEvent, useState} from "react";
import {ChatMessageInput} from "../../modules/chatroom/ChatMessageInput";
import {ChatFileInput} from "~/modules/chatroom/ChatFileInput";
import {trpc} from "../../utils/trpc";
import {IconButton} from "../common/IconButton";
import type {Input} from "../../server/msg/add";
import {SendIcon} from "../common/icons/SendIcon";
import {LoadingIcon} from "../common/icons/LoadingIcon";
import {InlineErrorSmall} from "../common/InlineErrorSmall";

export const SendMessageForm: FC = () => {
  const [messageValue, setMessageValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  let {mutateAsync, isLoading, isError} = trpc.msg.add.useMutation();
  
  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    
    // Don't send empty messages
    const trimmedMessage = messageValue.trim();
    if (trimmedMessage.length == 0) return;
    
    const request: Input = {message: trimmedMessage};
    
    if (file !== null) {
      // TODO Validate mime type
      const extension = file.name.match(/.+(\..+)/);
      if (extension === null || extension.length < 2)
        throw new TypeError("Invalid file name");
      
      request.image = {
        formatExtension: extension[1] // Group 1 will be only the extension
      }
    }
    
    const response = await mutateAsync(request);
    
    if (file !== null && response.imageUrl !== undefined) {
      await fetch(response.imageUrl, {
        method: "PUT",
        body: await file.arrayBuffer(),
      })
    }
    
    setFile(null);
    setMessageValue("");
  }
  
  return (
    <form className={"bg-back-light-0 shadow p-3"} onSubmit={submitForm}>
      {isError && <InlineErrorSmall message={"An error occurred. Try again later."}/>}
      <div className={"flex gap-3 items-center"}>
        <ChatMessageInput inputValue={messageValue} onInputChange={setMessageValue} imageNamePreviewValue={file?.name}
                          removeImage={() => setFile(null)}/>
        <ChatFileInput setFile={setFile}/>
        <div>
          <IconButton type={"submit"} disabled={isLoading}>
            {!isLoading && <SendIcon width={"2rem"} height={"2rem"}/>}
            {isLoading && <LoadingIcon width={"2rem"} height={"2rem"}/>}
          </IconButton>
        </div>
      </div>
    </form>
  )
}