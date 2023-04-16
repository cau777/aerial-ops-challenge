import {FC} from "react";

type Props = {
  message: string;
  onClose: () => void;
}

export const ErrorModal: FC<Props> = (props) => {
  return (
    <>
      <div className={"fixed top-0 left-0 h-[100vh] w-[100vw] bg-black bg-opacity-30 cursor-pointer"} onClick={props.onClose}>
        <div className={"mx-auto max-w-2xl cursor-auto"} onClick={e => e.stopPropagation()}>
          <div className={"m-8 p-5 bg-back-light-50 opacity-100 rounded"}>
            <h2 className={"text-lg"}>Error</h2>
            <hr className={"my-2"}/>
            <p>{props.message}</p>
            <button type={"button"} className={"rounded border-2 px-2 py-1 ms-auto block mt-2"} onClick={props.onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  )
}