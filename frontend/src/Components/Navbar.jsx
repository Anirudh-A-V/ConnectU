import { useEffect, useState } from "react";
import { useStateContext } from "../Contexts/StateContext";
import { AiOutlineLogout } from "react-icons/ai";
import { BiCheck, BiX } from "react-icons/bi";
import { SiQuantconnect } from "react-icons/si"
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import NavDropdown from "./NavDropdown";
import world from "../Assets/world.svg"
import search from "../Assets/search.svg"

const Navbar = ({ handleSearch }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true)
    const [showSearch, setShowSearch] = useState(false)

    const { user, query, setQuery } = useStateContext()

    const Token = sessionStorage.getItem("token")
    const User = sessionStorage.getItem("user").replace(/['"]+/g, '')


    const logout = () => {
        sessionStorage.setItem("token", "")
        fetch(`${import.meta.env.VITE_API_URI}/logout`, {
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
        <nav className=" bg-white w-full flex relative justify-between items-center mx-auto px-8 h-20 top-0">
            <div className="inline-flex">
                <Link to="/home">
                    <div className="hidden md:block">
                        <SiQuantconnect size="2.5rem" className="text-gray-800" />
                    </div>
                    <div className="block md:hidden">
                        <SiQuantconnect size="2.5rem" className="text-gray-800" />
                    </div>
                </Link>
            </div>
            {window.innerWidth > 768 ? (
                <div className="hidden md:block flex-shrink flex-grow-0 justify-start px-2">
                    <div className="inline-block">
                        <div className="inline-flex items-center max-w-full">
                            <div className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-96 border rounded-full px-1  py-1" type="button">
                                {/* <div className="block flex-grow flex-shrink overflow-hidden">Start your search</div> */}
                                <input className="ml-2 block flex-grow flex-shrink overflow-hidden focus:border-gray-300" placeholder="Start your search" onChange={(e) => setQuery(e.target.value)} />
                                <div className="flex items-center justify-center relative cursor-pointer h-8 w-8 rounded-full">
                                    <img src={search} alt="Search" className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="block sm:hidden flex-shrink flex-grow-0 justify-end px-2">
                        <div className="inline-block">
                            <div className="inline-flex items-center max-w-full">
                                <div className="flex items-center justify-center relative cursor-pointer h-8 w-8 rounded-full" onClick={() => setShowSearch(!showSearch)}>
                                    <img src={search} alt="Search" className="h-5 w-5" />
                                </div>
                   ++         </div>
                            {showSearch && 
                                <div className="absolute top-0 right-0 mt-16 mr-4">
                                    <div className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-80 border rounded-full px-1  py-1" type="button">
                                        {/* <div className="block flex-grow flex-shrink overflow-hidden">Start your search</div> */}
                                        <input className="ml-2 h-8 flex flex-grow justify-center items-center flex-shrink overflow-hidden focus:border-gray-300" placeholder="Start your search" onChange={(e) => setQuery(e.target.value)} />
                                        <div className="flex items-center justify-center relative cursor-pointer h-8 w-8 rounded-full">
                                            <img src={search} alt="Search" className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </>
            )}
            <div className="flex-initial">
                <div className="flex justify-end items-center relative">

                    <div className="flex mr-4 items-center">
                        <Link className=" hidden sm:inline-block py-2 px-3 hover:bg-gray-200 rounded-full" to={'/friends'} >
                            <div className="flex items-center relative cursor-pointer whitespace-nowrap">Your Friends</div>
                        </Link>
                        <div className="block relative">
                            {/* Friend Request Button Start */}
                            <button type="button" className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative " onClick={() => setShowDropdown(!showDropdown)}>
                                <div className="flex items-center h-5">
                                    <div className="_xpkakx">
                                        <img src={world} alt="world" className="h-5 w-5" />
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

                    <div className="flex mr-4 items-center">
                        <Link className=" hidden sm:inline-block py-2 px-3 hover:bg-gray-200 rounded-full" to={'/profile'} >
                            {user && user.image ? <img src={user.image} className="h-6 w-6 rounded-full" /> : < CgProfile className="h-6 w-6" />}
                            {/* <img src={user?.image} className="h-6 w-6" /> */}
                            {/* < CgProfile className="h-6 w-6" /> */}
                        </Link>
                    </div>


                    {window.innerWidth > 768 ? (
                        <div className="block">
                            <div className="inline relative">
                                <button type="button" className="inline-flex items-center relative px-2 border rounded-full hover:shadow-lg" onClick={logout}>
                                    <div className="block flex-grow-0 flex-shrink-0 h-10 w-12 p-[8px]">
                                        <AiOutlineLogout style={{ display: "block", height: "100%", width: "100%", fill: "currentcolor" }} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="block">
                            <NavDropdown />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar