import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const [login, setLogin] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <StateContext.Provider
            value={{
                login,
                setLogin,
                selectedFile,
                setSelectedFile
            }}
        >
            {children}
        </StateContext.Provider>

    )
}

export const useStateContext = () => useContext(StateContext);