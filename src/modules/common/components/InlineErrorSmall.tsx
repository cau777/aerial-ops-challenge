import {FC} from "react";
import {ExclamationCircleIcon} from "./icons/ExclamationCircleIcon";

type Props = {
  message: string;
}

export const InlineErrorSmall: FC<Props> = (props) => {
  return (
    <div className={"text-sm text-red-600 flex gap-1"}>
      <ExclamationCircleIcon width={"1.2rem"} height={"1.2rem"}/>
      {props.message}
    </div>
  )
}