import {ChangeEvent, FC} from "react";
import {ClipIcon} from "../common/icons/ClipIcon";

type Props = {
  setFile: (value: File | null) => void;
}

export const ChatFileInput: FC<Props> = (props) => {
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files == null)
      props.setFile(null);
    else {
      props.setFile(files.item(0));
      // Clears the input to be ready for the next file
      e.currentTarget.value = "";
    }
  }
  
  return (
    <label htmlFor={"fileInput"}>
      <div className={"p-2 bg-blue-400 rounded cursor-pointer"}>
        <input id={"fileInput"} className={"hidden pointer"} type={"file"} multiple={false}
               accept={"image/png,image/jpeg"}
               onChange={change}/>
        <ClipIcon width={"2rem"} height={"2rem"}/>
      </div>
    </label>
  )
}