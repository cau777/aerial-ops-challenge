import {FC} from "react";
import {trpc} from "../../utils/trpc";
import {TrashIcon} from "../common/icons/TrashIcon";
import {LoadingIcon} from "../common/icons/LoadingIcon";
import {InlineErrorSmall} from "../common/InlineErrorSmall";

type Props = {
  id: string;
  message: string;
  image?: string;
  timestamp: number;
  onDeleted: () => void;
}

const formatTime = (date: Date) => {
  const millis = new Date().getTime() - date.getTime();
  
  const minutes = Math.round(millis / 1_000 / 60);
  if (minutes < 1)
    return "Just now"
  
  if (minutes < 64)
    return minutes + " minutes ago";
  
  if (minutes < 24 * 60)
    return date.toLocaleTimeString();
  
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

/**
 * The public url is generated without the s3 SDK to avoid increasing the bundle size
 * @param image
 */
const createS3PublicUrl = (image: string) => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${image}`;
}

// TODO: useMemeo
// Reduce layout shifts
export const MessageDisplay: FC<Props> = (props) => {
  const {mutateAsync, isLoading, isError, isIdle} = trpc.msg.delete.useMutation({
    onSuccess: props.onDeleted,
  });
  
  const deleteClicked = async () => {
    if (isIdle)
      await mutateAsync({id: props.id});
  }
  
  return (
    <div className={""}>
      <div className={"group mb-1 m-3 inline-block bg-back-light-0 min-w-[12rem] p-3 max-w-[70%] break-words shadow"}>
        <div
          className={"opacity-0 group-hover:opacity-100 float-right cursor-pointer transition-all duration-200 hover:text-red-600"}
          onClick={deleteClicked}>
          {isIdle && <TrashIcon width={"1.5rem"} height={"1.5rem"}/>}
          {isLoading && <LoadingIcon width={"1.5rem"} height={"1.5rem"}/>}
          {isError && <InlineErrorSmall message={"An error occurred. Try again later."}/>}
        </div>
        <p>{props.message}</p>
        {props.image && (
          <img className={"h-[12rem] max-w-full"} src={createS3PublicUrl(props.image)} alt={props.message}/>
        )}
      </div>
      <div className={"ms-3 text-xs"}>{formatTime(new Date(props.timestamp))}</div>
    </div>
  )
}