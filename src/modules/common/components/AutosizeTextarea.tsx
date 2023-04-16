import {FC, KeyboardEvent} from "react";
import {prepareKey} from "../../chatroom/utils/formatting";

type Props = {
  value: string;
  onChange?: (value: string) => void;
  onKeyDown?: (key: string, shift: boolean, alt: boolean, ctrl: boolean) => void;
  maxRows?: number;
  minRows?: number;
  autoSize?: boolean;
  manualResize?: boolean;
  maxLength?: number;
}

export const AutosizeTextarea: FC<Props> = (props) => {
  const getSize = (text: string) => {
    const newlines = text.match(/\n/g) || [];
    return Math.max(props.minRows ?? 1, Math.min(props.maxRows ?? 50, newlines.length + 1));
  }
  
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (props.onKeyDown !== undefined)
      props.onKeyDown(prepareKey(e.key), e.shiftKey, e.altKey, e.ctrlKey)
  }
  
  const rows = props.autoSize ? getSize(props.value) : undefined;
  
  return (
    <textarea
      className={"resize-none border-2 w-full rounded bg-back-light-100 p-2 outline-none focus:border-blue-400 transition-all duration-200"}
      rows={rows} onChange={e => props.onChange?.(e.currentTarget.value)} value={props.value}
      maxLength={props.maxLength}
      onKeyDown={onKeyDown}></textarea>
  )
}