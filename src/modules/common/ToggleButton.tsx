import {FC, PropsWithChildren} from "react";

type Props = {
  toggled: boolean;
  onClick: () => void;
}

export const ToggleButton: FC<PropsWithChildren<Props>> = (props) => {
  const background = props.toggled ? "bg-blue-400" : "bg-white-0";
  return (
    <button className={"p-2 border-2 rounded border-blue-400 " + background}
            onClick={props.onClick}>{props.children}{props.toggled}</button>
  )
}