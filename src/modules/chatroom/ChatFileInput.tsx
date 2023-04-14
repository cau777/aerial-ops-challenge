import {ChangeEvent, FC} from "react";
import {createStyles} from "@mantine/core";

type Props = {
  setFile: (value: File | null) => void;
}

const useStyle = createStyles((theme) => ({
  input: {
    color: "white",
    display: "none"
  },
  icon: {
    backgroundColor: theme.colors.blue[6],
    color: "white",
    padding: "0.325rem",
    borderRadius: "0.25rem",
    cursor: "pointer"
  }
}))

export const ChatFileInput: FC<Props> = (props) => {
  const {classes} = useStyle();
  
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files == null)
      props.setFile(null)
    else
      props.setFile(files.item(0))
  }
  
  return (
    <label htmlFor={"fileInput"}>
      <input id={"fileInput"} className={classes.input} type={"file"} multiple={false} accept={"image/png,image/jpeg"}
             onChange={change}/>
      <div className={classes.icon}>Icon</div>
    </label>
  )
}