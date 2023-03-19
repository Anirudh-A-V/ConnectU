import React, { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import { useStateContext } from "../Contexts/StateContext";

const NavDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const { user, query, setQuery } = useStateContext()

    const Token = localStorage.getItem("token")
    const User = localStorage.getItem("user").replace(/['"]+/g, '')


    const logout = () => {
        localStorage.setItem("token", "")
        fetch("${import.meta.env.VITE_API_URI}/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user": {
                    "username": user.username
                }
            })
        })
        window.location.reload()
    }

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center items-center border rounded-full hover:shadow-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={toggleDropdown}
                >
                    <IoMdMenu className="w-5 h-5" />
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <Link
                            to={"/profile"}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                        >
                            Profile
                        </Link>
                        <Link
                            to={"/friends"}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                        >
                            Your Friends
                        </Link>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                            onClick={logout}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavDropdown;
