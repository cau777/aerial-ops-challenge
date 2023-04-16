import React, {FC, useState} from "react";
import {ChatMessageInput} from "./ChatMessageInput";
import {ChatFileInput} from "./ChatFileInput";
import {trpc} from "../../common/hooks/trpc";
import {IconButton} from "../../common/components/IconButton";
import type {Input} from "../../../server/msg/add";
import {SendIcon} from "../../common/components/icons/SendIcon";
import {LoadingIcon} from "../../common/components/icons/LoadingIcon";
import {InlineErrorSmall} from "../../common/components/InlineErrorSmall";
import {configureOptimisticUpdates} from "../utils/optimistic-updates";

export type FileWithExtension = {file: File; extension: string};

export const SendMessageForm: FC = () => {
  const [messageValue, setMessageValue] = useState("");
  const [file, setFile] = useState<FileWithExtension | null>(null);
  const utils = trpc.useContext();
  
  let {mutateAsync, isLoading, isError} = trpc.msg.add.useMutation({
    ...configureOptimisticUpdates(utils, (old, nValue) => {
      return (old === undefined ? [nValue] : [...old, nValue]);
    }),
  });
  
  const sendMessage = async () => {
    const initialMessage = messageValue;
    setMessageValue("");
    
    try {
      // Don't send empty messages
      const trimmedMessage = messageValue.trim();
      if (trimmedMessage.length == 0) return;
      
      const request: Input = {message: trimmedMessage};
      
      if (file !== null) {
        request.image = {
          formatExtension: file.extension // Group 1 will be only the extension
        }
      }
      
      const response = await mutateAsync(request);
      
      if (file !== null && response.imageUrl !== undefined) {
        await fetch(response.imageUrl, {
          method: "PUT",
          body: await file.file.arrayBuffer(),
        })
      }
      
      setFile(null);
    } catch (e) {
      // If an error occurred, fill the message again
      setMessageValue(initialMessage);
    }
  }
  
  return (
    <div className={"bg-back-light-0 shadow p-3"}>
      {isError && <InlineErrorSmall message={"An error occurred. Try again later."}/>}
      <div className={"flex gap-3 items-center"}>
        <ChatMessageInput inputValue={messageValue} onInputChange={setMessageValue} imageNamePreviewValue={file?.file.name}
                          removeImage={() => setFile(null)} onSubmitMessage={sendMessage}/>
        <ChatFileInput setFile={setFile}/>
        <div>
          <IconButton type={"button"} onClick={sendMessage} disabled={isLoading}>
            {!isLoading && <SendIcon width={"2rem"} height={"2rem"}/>}
            {isLoading && <LoadingIcon width={"2rem"} height={"2rem"}/>}
          </IconButton>
        </div>
      </div>
    </div>
  )
}