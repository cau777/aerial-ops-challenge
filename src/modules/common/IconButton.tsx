import {FC, PropsWithChildren} from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean; // TODO
  type: "submit"|"reset"|"button";
}

export const IconButton: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <button onClick={() => props.onClick?.()} className={"p-2 bg-blue-400 rounded"} disabled={props.disabled} type={props.type}>
      {props.children}
    </button>
  )
}