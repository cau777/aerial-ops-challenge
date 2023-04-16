import {FC} from "react";
import {useInView} from "react-intersection-observer";
import {LoadingIcon} from "../../common/components/icons/LoadingIcon";

type Props = {
  onFeedEndVisible: () => void;
  isLoading: boolean;
}

export const FeedEndIndicator: FC<Props> = (props) => {
  const {ref} = useInView({
    onChange: (isVisibleNow) => {
      if (isVisibleNow && !props.isLoading)
        props.onFeedEndVisible();
    },
    root: null,
    threshold: 0.1,
    triggerOnce: true,
  });
  
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