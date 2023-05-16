import React, { useEffect } from "react";
import useTheme from "../../hooks/useTheme";

const Layout = ({ children }) => {
  const { typeTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem("theme", typeTheme);
  }, [typeTheme]);

  return (
    <div className={`layout ${typeTheme === "dark" ? "dark" : ""}`}>
      {children}
    </div>
  );
};

export default Layout;
