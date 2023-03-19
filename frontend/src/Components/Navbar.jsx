import { useEffect, useState } from "react";
import { useStateContext } from "../Contexts/StateContext";
import { AiOutlineLogout } from "react-icons/ai";
import { BiCheck, BiX } from "react-icons/bi";
import { SiQuantconnect } from "react-icons/si"
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import NavDropdown from "./NavDropdown";

const Navbar = ({ handleSearch }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true)
    const [showSearch, setShowSearch] = useState(false)

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

    const getFriendRequests = async () => {
        console.log("Getting Friend Requests", User)
        setLoading(true)


        const response = fetch(`${import.meta.env.VITE_API_URI}/friendrequests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "username": User
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setFriendRequests(data.friendRequests)
                console.log("Friend Requests", friendRequests)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const acceptFriendRequest = async (username) => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/accept`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "username": User
                },
                "friend": {
                    "username": username
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    console.log("Accepted")
                    setFriendRequests(friendRequests.filter((request) => { return request.username != username }))
                }
            })
            .catch(err => {
                console.log(err)
            })

        getFriendRequests()
    }

    const rejectFriendRequest = async (id) => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/ignore/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "username": User
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    console.log("Ignored")
                    // console.log("Rejected", friendRequests)
                    setFriendRequests(friendRequests.filter((request) => { return request._id != id }))
                }
            })
            .catch(err => {
                console.log(err)
            })
        getFriendRequests()
    }


    useEffect(() => {
        setTimeout(() => {
            getFriendRequests()
        }, 2000)
    }, [])



    return (
        <nav class=" bg-white w-full flex relative justify-between items-center mx-auto px-8 h-20 top-0">
            <div class="inline-flex">
                <Link to="/home">
                    <div class="hidden md:block">
                        <SiQuantconnect size="2.5rem" className="text-gray-800" />
                    </div>
                    <div class="block md:hidden">
                        <SiQuantconnect size="2.5rem" className="text-gray-800" />
                    </div>
                </Link>
            </div>
            {window.innerWidth > 768 ? (
                <div class="hidden md:block flex-shrink flex-grow-0 justify-start px-2">
                    <div class="inline-block">
                        <div class="inline-flex items-center max-w-full">
                            <div class="flex items-center flex-grow-0 flex-shrink pl-2 relative w-96 border rounded-full px-1  py-1" type="button">
                                {/* <div class="block flex-grow flex-shrink overflow-hidden">Start your search</div> */}
                                <input class="ml-2 block flex-grow flex-shrink overflow-hidden focus:border-gray-300" placeholder="Start your search" onChange={(e) => setQuery(e.target.value)} />
                                <div class="flex items-center justify-center relative cursor-pointer h-8 w-8 rounded-full">
                                    <svg
                                        viewBox="0 0 32 32"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        role="presentation"
                                        focusable="false"
                                        style={{
                                            display: "block",
                                            fill: "none",
                                            height: "12px",
                                            width: "12px",
                                            stroke: "rgb(55, 65, 81)",
                                            strokeWidth: 5.33333,
                                            overflow: "visible",
                                        }}
                                    >
                                        <g fill="none">
                                            <path
                                                d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div class="block sm:hidden flex-shrink flex-grow-0 justify-end px-2">
                        <div class="inline-block">
                            <div class="inline-flex items-center max-w-full">
                                <div class="flex items-center justify-center relative cursor-pointer h-8 w-8 rounded-full" onClick={() => setShowSearch(!showSearch)}>
                                    <svg
                                        viewBox="0 0 32 32"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        role="presentation"
                                        focusable="false"
                                        style={{
                                            display: "block",
                                            fill: "none",
                                            height: "16px",
                                            width: "16px",
                                            stroke: "rgb(55, 65, 81)",
                                            strokeWidth: 5.33333,
                                            overflow: "visible",
                                        }}
                                    >
                                        <g fill="none">
                                            <path
                                                d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            {showSearch && (
                                <div className="absolute top-0 right-0 mt-16 mr-4">
                                    <div class="flex items-center flex-grow-0 flex-shrink pl-2 relative w-80 border rounded-full px-1  py-1" type="button">
                                        {/* <div class="block flex-grow flex-shrink overflow-hidden">Start your search</div> */}
                                        <input class="ml-2 h-8 flex flex-grow justify-center items-center flex-shrink overflow-hidden focus:border-gray-300" placeholder="Start your search" onChange={(e) => setQuery(e.target.value)} />
                                        <div class="flex items-center justify-center relative cursor-pointer h-8 w-8 rounded-full">
                                            <svg
                                                viewBox="0 0 32 32"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                                role="presentation"
                                                focusable="false"
                                                style={{
                                                    display: "block",
                                                    fill: "none",
                                                    height: "12px",
                                                    width: "12px",
                                                    stroke: "rgb(55, 65, 81)",
                                                    strokeWidth: 5.33333,
                                                    overflow: "visible",
                                                }}
                                            >
                                                <g fill="none">
                                                    <path
                                                        d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"
                                                    ></path>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            <div class="flex-initial">
                <div class="flex justify-end items-center relative">

                    <div class="flex mr-4 items-center">
                        <Link class=" hidden sm:inline-block py-2 px-3 hover:bg-gray-200 rounded-full" to={'/friends'} >
                            <div class="flex items-center relative cursor-pointer whitespace-nowrap">Your Friends</div>
                        </Link>
                        <div class="block relative">
                            {/* Friend Request Button Start */}
                            <button type="button" class="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative " onClick={() => setShowDropdown(!showDropdown)}>
                                <div class="flex items-center h-5">
                                    <div class="_xpkakx">
                                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "16px", width: "16px", fill: "currentcolor" }}><path d="m8.002.25a7.77 7.77 0 0 1 7.748 7.776 7.75 7.75 0 0 1 -7.521 7.72l-.246.004a7.75 7.75 0 0 1 -7.73-7.513l-.003-.245a7.75 7.75 0 0 1 7.752-7.742zm1.949 8.5h-3.903c.155 2.897 1.176 5.343 1.886 5.493l.068.007c.68-.002 1.72-2.365 1.932-5.23zm4.255 0h-2.752c-.091 1.96-.53 3.783-1.188 5.076a6.257 6.257 0 0 0 3.905-4.829zm-9.661 0h-2.75a6.257 6.257 0 0 0 3.934 5.075c-.615-1.208-1.036-2.875-1.162-4.686l-.022-.39zm1.188-6.576-.115.046a6.257 6.257 0 0 0 -3.823 5.03h2.75c.085-1.83.471-3.54 1.059-4.81zm2.262-.424c-.702.002-1.784 2.512-1.947 5.5h3.904c-.156-2.903-1.178-5.343-1.892-5.494l-.065-.007zm2.28.432.023.05c.643 1.288 1.069 3.084 1.157 5.018h2.748a6.275 6.275 0 0 0 -3.929-5.068z"></path></svg>
                                    </div>
                                </div>
                            </button>
                            {/* Friend Request Button Start */}
                            {/* Friend Request Dropdown Start */}
                            {showDropdown && (
                                <div className="absolute right-0 ml-2 md:ml-0 mt-2 w-72 md:w-80  bg-white rounded-md shadow-lg z-10">
                                    {loading ? <Spinner screen={false} /> : (
                                        <div className="py-1">
                                            {friendRequests.length > 0 ? friendRequests.map((request, index) => (
                                                <div className="flex justify-between items-center px-4 py-2 mb-1" key={index}>
                                                    <div className="flex items-center">
                                                        <img src={request.image} className="h-10 w-10 rounded-full mr-4 object-cover object-center" alt="avatar" />
                                                        <span className="text-base font-medium text-gray-600">{request.name.first} {request.name.last}</span>
                                                    </div>
                                                    <div className="flex">
                                                        <button
                                                            onClick={() => { acceptFriendRequest(request.username) }}
                                                            className="flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-bold w-10 h-10 p-2 rounded-full mr-2"
                                                        >
                                                            <BiCheck className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                rejectFriendRequest(request._id)
                                                            }}
                                                            className="flex justify-center items-center bg-red-500 hover:bg-red-600 w-10 h-10 p-2 text-white font-bold rounded-full"
                                                        >
                                                            <BiX className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="flex justify-center items-center px-4 py-2 mb-1">
                                                    <span className="text-base font-medium text-gray-600">No Friend Requests</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Friend Request Dropdown End */}
                        </div>
                    </div>

                    <div class="flex mr-4 items-center">
                        <Link class=" hidden sm:inline-block py-2 px-3 hover:bg-gray-200 rounded-full" to={'/profile'} >
                            {user && user.image ? <img src={user.image} class="h-6 w-6 rounded-full" /> : < CgProfile class="h-6 w-6" />}
                            {/* <img src={user?.image} class="h-6 w-6" /> */}
                            {/* < CgProfile class="h-6 w-6" /> */}
                        </Link>
                    </div>


                    {window.innerWidth > 768 ? (
                        <div class="block">
                            <div class="inline relative">
                                <button type="button" class="inline-flex items-center relative px-2 border rounded-full hover:shadow-lg" onClick={logout}>
                                    <div class="block flex-grow-0 flex-shrink-0 h-10 w-12 p-[8px]">
                                        <AiOutlineLogout style={{ display: "block", height: "100%", width: "100%", fill: "currentcolor" }} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div class="block">
                            <NavDropdown />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar