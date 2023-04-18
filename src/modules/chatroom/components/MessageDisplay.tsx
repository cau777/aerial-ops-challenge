import {FC, memo} from "react";
import {trpc} from "../../common/hooks/trpc";
import {TrashIcon} from "../../common/components/icons/TrashIcon";
import {LoadingIcon} from "../../common/components/icons/LoadingIcon";
import {InlineErrorSmall} from "../../common/components/InlineErrorSmall";
import {formatTime} from "../utils/formatting";
import {configureOptimisticUpdates} from "../utils/optimistic-updates";
import {MessageImage} from "./MessageImage";

type Props = {
  id: string;
  message: string;
  image?: string;
  timestamp: number;
}

const MessageDisplayInner: FC<Props> = (props) => {
  const utils = trpc.useContext();
  const {mutateAsync, isLoading, isError, isIdle, error} = trpc.msg.delete.useMutation({
    ...configureOptimisticUpdates(utils, (old, nValue) => {
      return (old === undefined ? [] : old.filter(o => o._id !== nValue.id));
    }),
  });
  
  const deleteClicked = async () => {
    try {
      if (isIdle && props.id.length > 0)
        await mutateAsync({id: props.id});
    } catch (e) {
    
    }
  }
  
  return (
    <div>
      <div className={"group mb-1 m-3 inline-block bg-back-light-0 min-w-[12rem] p-3 max-w-[70%] break-words shadow"}>
        <div
          className={"opacity-0 group-hover:opacity-100 float-right cursor-pointer transition-all duration-200 hover:text-red-600"}
          onClick={deleteClicked}>
          {isIdle && <TrashIcon width={"1.5rem"} height={"1.5rem"}/>}
          {isLoading && <LoadingIcon width={"1.5rem"} height={"1.5rem"}/>}
          {isError && <InlineErrorSmall message={`Error: ${error}. Try again later.`}/>}
        </div>
        <p className={"whitespace-pre-wrap"}>{props.message}</p>
        {props.image && (
          <MessageImage src={props.image} alt={props.message}/>
        )}
      </div>
      <div className={"ms-3 text-xs"}>{formatTime(new Date(props.timestamp))}</div>
    </div>
  )
}

// Memo is used to improve performance by skipping re-rendering the component when its props are unchanged
export const MessageDisplay = memo(MessageDisplayInner);