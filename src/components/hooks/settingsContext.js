import { createContext, useState } from "react";

const SettingsContext = createContext();

function SettingsContextProvider({ children }) {
    const [settings, setSettings] = useState({
        picture: 'flowers',
        puzzleType: 5,
        showNums: false,
    });

    return (
        <SettingsContext.Provider value={{settings, setSettings}}>
            {children}
        </SettingsContext.Provider>
    )
}

export {SettingsContext, SettingsContextProvider };