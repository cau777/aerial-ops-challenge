import {FC} from "react";

type Props = {
  data: {label: string, value: string}[];
  onChange: (value: string) => void;
}

export const SimpleSelect: FC<Props> = (props) => {
  return (
    <select className={"border-2 rounded ps-2 font-light outline-none focus:border-blue-800"}>
      {props.data.map(o => (
        <option value={o.value} key={o.value}>{o.label}</option>
      ))}
    </select>
  )
}