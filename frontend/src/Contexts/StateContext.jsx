import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext({
    token: "",
    setToken: () => { },
    count: 0,
    setCount: () => { },
});

export const ContextProvider = ({ children }) => {
    const [login, setLogin] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);

    const [token, setToken] = useState("");
    const [count, setCount] = useState(0);

    return (
        <StateContext.Provider
            value={{
                token,
                setToken,
                count,
                setCount,
            }}
        >
            {children}
        </StateContext.Provider>

    )
}

export const useStateContext = () => useContext(StateContext);