import * as React from "react";

export const useResize = () => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    setIsTablet(width < 640);
  }, [width]);

  return { isTablet, width };
};
