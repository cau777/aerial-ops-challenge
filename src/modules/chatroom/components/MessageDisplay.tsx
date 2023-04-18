'use client'

import {FC, memo} from "react";
import {trpc} from "../../common/hooks/trpc";
import {TrashIcon} from "../../common/components/icons/TrashIcon";
import {configureOptimisticUpdatesForMsg} from "../utils/optimistic-updates";
import {MessageImage} from "./MessageImage";
import {OrderFlow, OrderKey} from "../../../server/msg/list";
import {PAGE_LIMIT} from "./MessagesFeed";
import {formatTime} from "../utils/formatting";

type Props = {
  id: string;
  message: string;
  image?: string;
  timestamp: number;
  orderKey: OrderKey;
  orderFlow: OrderFlow;
  onDeleteError: (message: string) => void;
}

const MessageDisplayInner: FC<Props> = (props) => {
  const utils = trpc.useContext();
  
  const {mutateAsync, isIdle} = trpc.msg.delete.useMutation({
    ...configureOptimisticUpdatesForMsg<"delete">(utils, {
      orderKey: props.orderKey,
      orderFlow: props.orderFlow,
      limit: PAGE_LIMIT,
    }, (old, nValue) => {
      if (old === undefined)
        return {
          pages: [],
          pageParams: []
        };
      
      return {
        pageParams: [...old.pageParams],
        pages: old.pages.map(page => page.filter(o => o._id !== nValue.id))
      }
    }, props.onDeleteError),
  });
  
  const deleteClicked = async () => {
    try {
      if (isIdle && props.id.length > 0 && props.id !== "optimistic-update")
        await mutateAsync({id: props.id});
    } catch (e) { }
  }
  
  return (
    <div>
      <div className={"group mb-1 m-3 inline-block bg-back-light-0 min-w-[12rem] p-3 max-w-[70%] break-words shadow"}>
        <div
          className={"opacity-0 group-hover:opacity-100 float-right cursor-pointer transition-all duration-200 hover:text-red-600"}
          onClick={deleteClicked}>
          {isIdle && <TrashIcon width={"1.5rem"} height={"1.5rem"}/>}
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