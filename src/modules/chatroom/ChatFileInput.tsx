import {ChangeEvent, FC} from "react";
import {IconButton} from "../common/IconButton";

type Props = {
  setFile: (value: File | null) => void;
}

export const ChatFileInput: FC<Props> = (props) => {
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files == null)
      props.setFile(null)
    else
      props.setFile(files.item(0))
  }
  
  return (
    <label htmlFor={"fileInput"}>
      <input id={"fileInput"} className={"hidden pointer"} type={"file"} multiple={false} accept={"image/png,image/jpeg"}
             onChange={change}/>
      <IconButton type={"button"} disabled={false}>Icon</IconButton>
    </label>
  )
}