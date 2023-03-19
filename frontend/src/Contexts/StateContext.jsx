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
    login: false,
    setLogin: () => { },
    firstName: "",
    setFirstName: () => { },
    lastName: "",
    setLastName: () => { },
    email: "",
    setEmail: () => { },
    password: "",
    setPassword: () => { },
});

export const ContextProvider = ({ children }) => {
    const [login, setLogin] = useState(false)

    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <StateContext.Provider
            value={{
                login,
                setLogin,
                token,
                setToken,
                user,
                setUser,
                users,
                setUsers,
                firstName,
                setFirstName,
                lastName,
                setLastName,
                email,
                setEmail,
                password,
                setPassword,

            }}
        >
            {children}
        </StateContext.Provider>

    )
}

export const useStateContext = () => useContext(StateContext);