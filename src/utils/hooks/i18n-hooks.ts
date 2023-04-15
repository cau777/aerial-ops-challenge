import {useEffect, useState} from "react";

export const useNavigator = () => {
  const [nav, setNavigator] = useState<Navigator>();
  useEffect(() => {
    setNavigator(navigator);
  }, []);
  return nav;
}