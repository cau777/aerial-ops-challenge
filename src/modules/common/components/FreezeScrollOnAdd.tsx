import {FC, HTMLProps, PropsWithChildren, UIEvent, useEffect, useRef} from "react";

type Props = HTMLProps<HTMLDivElement>

export const FreezeScrollOnAdd: FC<PropsWithChildren<Props>> = (props) => {
  const elementRef = useRef<HTMLDivElement|null>(null);
  const scrollFromBottomRef = useRef(0);
  
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    scrollFromBottomRef.current = element.scrollHeight - element.scrollTop;
  }
  
  useEffect(() => {
    if (scrollFromBottomRef.current === undefined||elementRef.current===null) return;
    elementRef.current.scrollTo(0, elementRef.current.scrollHeight - scrollFromBottomRef.current);
  }, [props.children]);
  
  return (
    <div {...props} onScroll={onScroll} ref={elementRef}>
      {props.children}
    </div>
  )
}