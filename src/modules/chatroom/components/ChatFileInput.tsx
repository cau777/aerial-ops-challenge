import {ChangeEvent, FC, useState} from "react";
import {ClipIcon} from "../../common/components/icons/ClipIcon";
import {ErrorModal} from "../../common/components/ErrorModal";
import {FileAndData} from "./SendMessageForm";

type Props = {
  setFile: (value: FileAndData | null) => void;
}

export const ChatFileInput: FC<Props> = (props) => {
  const [error, setError] = useState<string>();
  
  const change = async (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const files = element.files;
    if (files == null) {
      props.setFile(null);
    } else {
      const file = files.item(0);
      if (file === null) {
        props.setFile(null);
        return;
      }
      
      if (!file.name.includes(".")) {
        setError("File should include an extension");
        return;
      }
      
      const extension = file.name.match(/.+(\..+)/);
      if (extension === null || extension.length < 2) {
        setError("File should have a valid extension");
        return;
      }
      
      // file.type is a MIME type like image/png
      if (!file.type.startsWith("image")) {
        setError("Please upload an image");
        return;
      }
      
      // The signed URL only allow uploads smaller that 1MB
      if (file.size > 1_000_000) {
        setError("The maximum file size allowed is 1MB");
        return;
      }
      
      props.setFile({
        file,
        extension: extension[1],
        size: file.size,
      });
      
      // Clears the input to be ready for the next file
      element.value = "";
    }
  }
  
  return (
    <>
      {error && <ErrorModal message={error} onClose={() => setError(undefined)}/>}
      <label htmlFor={"fileInput"}>
        <div className={"p-2 bg-blue-400 rounded cursor-pointer"}>
          <input id={"fileInput"} className={"hidden pointer"} type={"file"} multiple={false}
                 accept={"image/png,image/jpeg"}
                 onChange={change}/>
          <ClipIcon width={"2rem"} height={"2rem"}/>
        </div>
      </label>
    </>
  )
}