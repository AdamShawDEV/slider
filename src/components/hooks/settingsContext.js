import { createContext, useState } from "react";
import { INITIAL_SETTINGS } from "../../CONSTS";

const SettingsContext = createContext();

function SettingsContextProvider({ children }) {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsContext, SettingsContextProvider };
