import {FC} from "react";
import {AutosizeTextarea} from "../common/AutosizeTextarea";

type Props = {
  inputValue: string;
  onInputChange: (value: string) => void;
  imageNamePreviewValue?: string;
}

export const ChatMessageInput: FC<Props> = (props) => {
  return (
    <div className={"relative w-full"}>
      <AutosizeTextarea value={props.inputValue} onChange={props.onInputChange} autoSize={true} minRows={2} maxRows={4}></AutosizeTextarea>
    </div>
  )
}