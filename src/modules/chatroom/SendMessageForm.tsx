import React, {FC, FormEvent, useState} from "react";
import {createStyles, Button} from "@mantine/core";
import {ChatMessageInput} from "~/modules/chatroom/ChatMessageInput";
import {useInputState} from "@mantine/hooks";
import {ChatFileInput} from "~/modules/chatroom/ChatFileInput";

const useStyles = createStyles(() => ({
  flexContainer: {
    display: "flex",
    gap: "0.4rem",
    alignItems: "center",
  }
}))

export const SendMessageForm: FC = () => {
  const [messageValue, setMessageValue] = useInputState("");
  const [file, setFile] = useState<File|null>(null);
  const {classes} = useStyles();
  
  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    
    // Don't send empty messages
    const trimmedMessage = messageValue.trim();
    if (trimmedMessage.length == 0) return;
    
    console.log(messageValue);
  }
  
  return (
    <form onSubmit={submitForm}>
      <div className={classes.flexContainer}>
        <ChatMessageInput inputValue={messageValue} setInputValue={setMessageValue}/>
        <ChatFileInput setFile={setFile}/>
        <Button type={"submit"}>Sub</Button>
      </div>
    </form>
  )
}