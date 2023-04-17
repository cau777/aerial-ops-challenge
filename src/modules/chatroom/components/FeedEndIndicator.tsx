import {FC} from "react";
import {useInView} from "react-intersection-observer";
import {LoadingIcon} from "../../common/components/icons/LoadingIcon";
import {InlineErrorSmall} from "../../common/components/InlineErrorSmall";

type Props = {
  onFeedShouldFetchMore: () => void;
  isLoading: boolean;
  error?: {message: string}|null;
}

export const FeedEndIndicator: FC<Props> = (props) => {
  const {ref} = useInView({
    onChange: (isVisibleNow) => {
      if (isVisibleNow && !props.isLoading)
        props.onFeedShouldFetchMore();
    },
    root: null,
    threshold: 0.1,
    triggerOnce: true,
  });
  
  if (props.error) return (
    <div className={"flex justify-center cursor-pointer"} onClick={() => props.onFeedShouldFetchMore()}>
      <InlineErrorSmall message={`Failed to get new messages. Reason: ${props.error.message}. Click to try again`}/>
    </div>
  )
  
  return (
    <div className={"text-center h-full pt-10 pb-4"}>
      {props.isLoading ? (
        <div className={"flex justify-center gap-2"}>
          <LoadingIcon width={"1.4rem"} height={"1.4rem"}/>
          <p>Loading...</p>
        </div>
      ) : (
        <p ref={ref}>This is the start of your amazing chat</p>
      )}
    
    </div>
  )
}