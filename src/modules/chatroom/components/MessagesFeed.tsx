import {FC, useState} from "react";
import {trpc} from "../../common/hooks/trpc";
import {OrderFlow, OrderKey} from "../../../server/msg/list";
import {MessageDisplay} from "./MessageDisplay";
import {FeedEndIndicator} from "./FeedEndIndicator";
import {FreezeScrollOnAdd} from "../../common/components/FreezeScrollOnAdd";
import {ErrorModal} from "../../common/components/ErrorModal";

export const PAGE_LIMIT = 5; // In production, limit probably should be higher. It's 5 for demonstration purposes.

type Props = {
  orderKey: OrderKey;
  orderFlow: OrderFlow;
}

export const MessagesFeed: FC<Props> = (props) => {
  const [deleteError, setDeleteError] = useState<string>();
  const {data, isLoading, isFetching, fetchNextPage, error} = trpc.msg.list.useInfiniteQuery({
    orderFlow: props.orderFlow,
    orderKey: props.orderKey,
    limit: PAGE_LIMIT,
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
    // If the last page returned no data, assume that there's no more data
    if (data !== undefined && data.pages.length !== 0 && data.pages[data.pages.length - 1].length === 0) {
      return;
    }
    await fetchNextPage();
  }
  
  return (
    <>
      {deleteError && <ErrorModal message={deleteError} onClose={() => setDeleteError(undefined)}/>}
      <FreezeScrollOnAdd className={"overflow-auto flex-grow h-full bg-back-light-200"}>
        <section className={"flex flex-col justify-center px-3 mb-4"}>
          <FeedEndIndicator key={data?.pages.length ?? -1} onFeedShouldFetchMore={onFeedEnd}
                            isLoading={isLoading || isFetching} error={error}/>
          
          {data?.pages.flatMap(o => o).reverse().map(m => (
            <MessageDisplay key={m._id} id={m._id} message={m.message} timestamp={m.timestamp}
                            image={m.type === "img" ? m.image : undefined} orderFlow={props.orderFlow}
                            orderKey={props.orderKey} onDeleteError={setDeleteError}></MessageDisplay>
          ))}
        </section>
      </FreezeScrollOnAdd>
    </>
  )
}