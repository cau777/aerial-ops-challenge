import {FC} from "react";
import {AutosizeTextarea} from "../common/AutosizeTextarea";

type Props = {
  inputValue: string;
  onInputChange: (value: string) => void;
  imageNamePreviewValue?: string;
  removeImage: () => void;
  onSubmitMessage: () => void;
}

export const ChatMessageInput: FC<Props> = (props) => {
  const onKeyDown = (key: string, shift: boolean) => {
    if (key === "Enter" && !shift)
      props.onSubmitMessage();
  }
  
  return (
    <div className={"w-full"}>
      {props.imageNamePreviewValue && (
        <div className={"flex"}>
          <div className={"flex gap-2 text-xs mt-1 ms-1 bg-back-light-200 rounded-xl mb-2 inline-block py-3/4 px-2"}>
            <div>{props.imageNamePreviewValue}</div>
            <div className={"cursor-pointer p-1/2"} onClick={() => props.removeImage()}>x</div>
          </div>
        </div>
      )}
      
      <AutosizeTextarea value={props.inputValue} onChange={props.onInputChange} autoSize={true} minRows={2}
                        maxRows={4} maxLength={500} onKeyDown={onKeyDown}></AutosizeTextarea>
    </div>
  )
}