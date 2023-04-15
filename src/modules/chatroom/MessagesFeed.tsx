import {FC} from "react";
import {trpc} from "../../utils/trpc";
import {OrderFlow, OrderKey} from "../../server/list";
import {MessageDisplay} from "./MessageDisplay";

type Props = {
  orderKey: OrderKey;
  orderFlow: OrderFlow;
}

export const MessagesFeed: FC<Props> = (props) => {
  const messagesQuery = trpc.msg.list.useQuery({orderFlow: props.orderFlow, orderKey: props.orderKey});
  
  return (
    <div className={"overflow-auto flex-grow h-full bg-back-light-200"}>
      {messagesQuery.isLoading}
      <section className={"flex flex-col justify-center px-3"}>
        {messagesQuery.data?.map((m: any) => (
          <MessageDisplay message={m.message} imageUrl={""} timestamp={m.timestamp}></MessageDisplay>
        ))}
      </section>
    </div>
  )
}