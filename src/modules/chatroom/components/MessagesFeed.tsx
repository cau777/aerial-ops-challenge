import {FC} from "react";
import {trpc} from "../../common/hooks/trpc";
import {OrderFlow, OrderKey} from "../../../server/msg/list";
import {MessageDisplay} from "./MessageDisplay";
import {FeedEndIndicator} from "./FeedEndIndicator";
import {FreezeScrollOnAdd} from "../../common/components/FreezeScrollOnAdd";

type Props = {
  orderKey: OrderKey;
  orderFlow: OrderFlow;
}

export const MessagesFeed: FC<Props> = (props) => {
  const {data, isLoading, isFetching, fetchNextPage} = trpc.msg.list.useInfiniteQuery({
    orderFlow: props.orderFlow,
    orderKey: props.orderKey,
    limit: 5, // In production, limit probably should be higher. It's 5 for demonstration purposes.
  }, {
    keepPreviousData: true,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0)
        return undefined;
      const last = lastPage[lastPage.length - 1];
      const value = props.orderKey === "message" ? last.message : last.timestamp
      
      return props.orderFlow === "asc" ? {max: value} : {min: value};
    },
  });
  
  const onFeedEnd = async () => {
    // If the last page returned no data
    if (data !== undefined && data.pages.length !== 0 && data.pages[data.pages.length - 1].length === 0) {
      return;
    }
    await fetchNextPage();
  }
  
  return (
    <FreezeScrollOnAdd className={"overflow-auto flex-grow h-full bg-back-light-200"}>
      <section className={"flex flex-col justify-center px-3 mb-4"}>
        <FeedEndIndicator key={data?.pages.length ?? -1} onFeedEndVisible={onFeedEnd}
                          isLoading={isLoading || isFetching}/>
        
        {data?.pages.flatMap(o => o).reverse().map(m => (
          <MessageDisplay key={m._id} id={m._id} message={m.message} timestamp={m.timestamp}
                          image={m.type === "img" ? m.image : undefined}></MessageDisplay>
        ))}
      </section>
    </FreezeScrollOnAdd>
  )
}