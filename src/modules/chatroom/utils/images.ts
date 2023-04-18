import {MutableRefObject} from "react";

export const Placeholder = "https://unper.ac.id/wp-content/plugins/tutor/assets/images/placeholder-.jpg";

/**
 * Sets the image as a placeholder and waits 3 seconds before trying to fetch the initial image again
 * @param element The target of the onError img event
 * @param refreshesRef
 */
export const scheduleImageRefresh = (element: EventTarget, refreshesRef: MutableRefObject<number>) => {
  if (!(element instanceof HTMLImageElement)) return;
  
  const src = element.src;
  if (src.length === 0 || src === Placeholder) return;
  
  if (refreshesRef.current >= 3) return; // Retry 3 times at most
  refreshesRef.current++;
  
  element.src = Placeholder;
  setTimeout(() => {
    element.src = src;
  }, 3_000);
}