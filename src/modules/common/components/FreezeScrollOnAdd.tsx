import {FC, HTMLProps, PropsWithChildren, UIEvent, useEffect, useRef} from "react";

type Props = HTMLProps<HTMLDivElement>

/**
 * When adding new messages at the top, the scroll would go to the top, disorienting the user and immediately loading
 * more messages. This component keeps track of the scroll position that the user wants and sets it after the children
 * change
 * @param props
 * @constructor
 */
export const FreezeScrollOnAdd: FC<PropsWithChildren<Props>> = (props) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const scrollFromBottomRef = useRef(0);
  
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    // The scroll distance from the bottom is considered because new messages will most likely be added to the top.
    scrollFromBottomRef.current = element.scrollHeight - element.scrollTop;
  }
  
  useEffect(() => {
    if (scrollFromBottomRef.current === undefined || elementRef.current === null) return;
    elementRef.current.scrollTo(0, elementRef.current.scrollHeight - scrollFromBottomRef.current);
  }, [props.children]);
  
  return (
    <div {...props} onScroll={onScroll} ref={elementRef}>
      {props.children}
    </div>
  )
}