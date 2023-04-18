import React, {FC, useState} from "react";
import {ChatMessageInput} from "./ChatMessageInput";
import {ChatFileInput} from "./ChatFileInput";
import {trpc} from "../../common/hooks/trpc";
import {IconButton} from "../../common/components/IconButton";
import type {ZInput} from "../../../server/msg/add";
import {SendIcon} from "../../common/components/icons/SendIcon";
import {LoadingIcon} from "../../common/components/icons/LoadingIcon";
import {InlineErrorSmall} from "../../common/components/InlineErrorSmall";
import {configureOptimisticUpdatesForMsg} from "../utils/optimistic-updates";
import {ZMessageModel} from "../../../server/models/message.model";
import {Placeholder} from "../utils/images";

export type FileAndData = {
  file: File;
  extension: string;
  size: number;
};

export const SendMessageForm: FC = () => {
  const [messageValue, setMessageValue] = useState("");
  const [file, setFile] = useState<FileAndData | null>(null);
  const utils = trpc.useContext();
  
  let {mutateAsync, isLoading, isError, error} = trpc.msg.add.useMutation({
    ...configureOptimisticUpdatesForMsg<"add">(utils, {
      orderFlow: "asc",
      orderKey: "time",
      limit: 5, // In production, limit probably should be higher. It's 5 for demonstration purposes.
    }, (old, nValue) => {
      const record: ZMessageModel & { _id: string } = nValue.image === undefined
        ? {
          type: "text",
          _id: "optimistic-update",
          message: nValue.message,
          timestamp: Date.now(),
        } : {
          type: "img",
          _id: "optimistic-update",
          message: nValue.message,
          timestamp: Date.now(),
          image: Placeholder,
        };
      
      if (old === undefined || old.pages.length === 0)
        return {pages: [[record]], pageParams: []}
      
      const pages = [...old.pages];
      pages[0] = [record, ...pages[0]];
      
      return {
        pages,
        pageParams: old.pageParams,
      }
    })
  });
  
  const sendMessage = async () => {
    const initialMessage = messageValue;
    
    // Clear the inputs
    setMessageValue("");
    setFile(null);
    
    try {
      // Don't send empty messages
      const trimmedMessage = messageValue.trim();
      if (trimmedMessage.length == 0) return;
      
      const request: ZInput = {message: trimmedMessage};
      
      // It's not necessary to further validate the file, because the previous functions already did it
      if (file !== null) {
        request.image = {
          formatExtension: file.extension,
          size: file.size,
        };
      }
      
      const response = await mutateAsync(request);
      
      if (file !== null && response.imageUrl !== undefined) {
        await fetch(response.imageUrl, {
          method: "PUT",
          body: await file.file.arrayBuffer(),
        });
      }
      
    } catch (e) {
      // If an error occurred, revert the message if it hasn't changed (so we don't end up deleting a message that
      // the user is currently typing)
      if (messageValue === "")
        setMessageValue(initialMessage);
    }
  }
  
  return (
    <div className={"bg-back-light-0 shadow p-3"}>
      {isError && <InlineErrorSmall message={`Failed to send message. Reason: ${error}. Try again later.`}/>}
      <div className={"flex gap-3 items-center"}>
        <ChatMessageInput inputValue={messageValue} onInputChange={setMessageValue}
                          imageNamePreviewValue={file?.file.name}
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