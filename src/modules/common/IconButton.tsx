import {FC, PropsWithChildren} from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean; // TODO
  type: "submit" | "reset" | "button";
}

export const IconButton: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <button onClick={() => props.onClick?.()} disabled={props.disabled} type={props.type}
            className={"p-2 bg-blue-400 rounded border-2 border-bg-400 " + (props.disabled ? "bg-blue-200 " : "")}>
      {props.children}
    </button>
  )
}