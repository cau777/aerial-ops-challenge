import {FC} from "react";
import {trpc} from "../../utils/trpc";
import {OrderFlow, OrderKey} from "../../server/msg/list";
import {MessageDisplay} from "./MessageDisplay";

type Props = {
  orderKey: OrderKey;
  orderFlow: OrderFlow;
}

export const MessagesFeed: FC<Props> = (props) => {
  // const scrollFromBottom = useRef(0);
  // const scrollableElementRef = useRef<HTMLDivElement|null>(null);
  const messagesQuery = trpc.msg.list.useQuery({orderFlow: props.orderFlow, orderKey: props.orderKey});
  
  // useEffect(() => {
  //   if (scrollableElementRef.current === null) return;
  //   scrollableElementRef.current.scroll
  // }, [messagesQuery.data])
  
  
  return (
    <div className={"overflow-auto flex-grow h-full bg-back-light-200"}>
      <section className={"flex flex-col justify-center px-3 mb-4"}>
        {messagesQuery.data?.map(m => (
          <MessageDisplay key={m._id} id={m._id} message={m.message} timestamp={m.timestamp}
                          image={m.type === "img" ? m.image : undefined}></MessageDisplay>
        ))}
      </section>
    </div>
  )
}