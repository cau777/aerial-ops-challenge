import {ChangeEventHandler, FC} from "react";
import {createStyles, Textarea} from "@mantine/core";

type Props = {
  inputValue: string;
  setInputValue: ChangeEventHandler<HTMLTextAreaElement>;
  imageNamePreviewValue?: string;
}

const useStyles = createStyles(() => ({
  input: {
    minHeight: "2rem",
    paddingTop: "1.2rem",
    width:  "100%",
    flexGrow: 1
  },
  inputWrapper: {
    width: "100%",
  },
  div: {
    width: "100%",
  }
}))

export const ChatMessageInput: FC<Props> = (props) => {
  const {classes} = useStyles();
  
  return (
    <div className={classes.div}>
      <Textarea classNames={{input: classes.input, wrapper: classes.inputWrapper}} onChange={props.setInputValue}
                value={props.inputValue} autosize maxRows={4}></Textarea>
    </div>
  )
}