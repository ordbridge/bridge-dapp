import { useEffect, useState } from "react";

const useMediaQuery = (query) => {
  const mediaQuery = window.matchMedia(query);
  const [match, setMatch] = useState(!!mediaQuery.matches);
  useEffect(() => {
    const handler = () => setMatch(!!mediaQuery.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined")
    return false;
  return match;
};

export default useMediaQuery;
