import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(() => {
  const getSavedValue = localStorage.getItem("theme");
  const initialValue = getSavedValue;
  return { typeTheme: initialValue } || { typeTheme: "light" };
});

export const ThemeProvider = ({ children }) => {
  const [typeTheme, setTypeTheme] = useState(() => {
    const getSavedValue = localStorage.getItem("theme");
    const initialValue = getSavedValue;
    return initialValue || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", typeTheme);
  }, [typeTheme]);

  const value = useMemo(
    () => ({
      typeTheme,
      setTypeTheme,
    }),
    [typeTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
