import {FC} from "react";

type Props = {
  value: string;
  onChange?: (value: string) => void;
  maxRows?: number;
  minRows?: number;
  autoSize?: boolean;
  manualResize?: boolean;
}

export const AutosizeTextarea: FC<Props> = (props) => {
  const getSize = (text: string) => {
    const newlines = text.match(/\n/g) || [];
    return Math.max(props.minRows??1, Math.min(props.maxRows ?? 50, newlines.length + 1));
  }
  
  const rows = props.autoSize ? getSize(props.value) : undefined;
  
  return (
    <textarea className={"resize-none border-2 w-full rounded bg-back-light-100 p-2 outline-none focus:border-blue-400 transition-all duration-200"}
              rows={rows} onChange={e => props.onChange?.(e.currentTarget.value)} value={props.value}></textarea>
  )
}