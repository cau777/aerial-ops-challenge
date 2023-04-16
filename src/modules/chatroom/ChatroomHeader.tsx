import {FC} from "react";
import {OrderFlow, OrderKey} from "../../server/msg/list";
import {ToggleButton} from "../common/ToggleButton";
import {SimpleSelect} from "../common/SimpleSelect";

type Props = {
  orderKey: OrderKey;
  onKeyChange: (value: OrderKey) => void;
  
  orderFlow: OrderFlow;
  onFlowChange: (value: OrderFlow) => void;
}

export const ChatroomHeader: FC<Props> = (props) => {
  return (
    <header>
      <div className={"flex bg-back-light-0 shadow align-middle gap-2 p-3"}>
        <h4 className={"hidden md:block me-auto"}>Welcome to the Chatroom!</h4>
        <SimpleSelect data={[{value: "time", label: "Sort by time"}, {value: "message", label: "Sort by message"}]}
                      onChange={o => props.onKeyChange(o as OrderKey)}></SimpleSelect>
        {/*<select value={props.orderKey} onSelect={e => props.onKeyChange(e.currentTarget.value as OrderKey)}>*/}
        {/*  <option value={"time"}>Sort by time</option>*/}
        {/*  <option value={"message"}>Sort by message</option>*/}
        {/*</select>*/}
        
        <ToggleButton toggled={props.orderFlow === "asc"} onClick={() => props.onFlowChange("asc")}>Asc</ToggleButton>
        <ToggleButton toggled={props.orderFlow === "desc"} onClick={() => props.onFlowChange("desc")}>Desc</ToggleButton>
      </div>
    </header>
  )
}