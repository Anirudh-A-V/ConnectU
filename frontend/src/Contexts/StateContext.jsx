import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext({
    token: "",
    setToken: () => { },
    count: 0,
    setCount: () => { },
    user: {},
    setUser: () => { },
    users: [],
    setUsers: () => { },
});

export const ContextProvider = ({ children }) => {
    const [login, setLogin] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);

    const [token, setToken] = useState("");
    const [count, setCount] = useState(0);
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);

    return (
        <StateContext.Provider
            value={{
                token,
                setToken,
                count,
                setCount,
                user,
                setUser,
                users,
                setUsers,
            }}
        >
            {children}
        </StateContext.Provider>

    )
}

export const useStateContext = () => useContext(StateContext);