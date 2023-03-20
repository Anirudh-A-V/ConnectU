import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Mutuals from "../Components/Mutuals";
import Spinner from "../Components/Spinner";

const User = () => {
    const { id } = useParams();
    const [publicuser, setPublicUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [hasRequested, setHasRequested] = useState(false);
    const [hasRecieved, setHasRecieved] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [mutualFriends, setMutualFriends] = useState([]);

    const User = sessionStorage.getItem("user").replace(/['"]+/g, '')
    const ID = sessionStorage.getItem("id").replace(/['"]+/g, '')

    const Token = sessionStorage.getItem("token");

    const getUser = async () => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/getUser/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setPublicUser(data.user)
                console.log("User State", publicuser)
                setLoading(false)
            })
            .catch(error => {
                console.log("Error fetching user:", error);
            });
    };

    const getMutualFriends = async () => {
        // setLoading(true)
        console.log("User -", User + " - Public User -", publicuser && publicuser.username)
        const response = fetch(`${import.meta.env.VITE_API_URI}/mutual/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "username": User
                },
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                console.log("Public User", publicuser.request)
                setMutualFriends(data.mutualFriendsList)
                console.log("Has Requested", hasRequested)
                console.log("Has Recieved", hasRecieved)
                console.log("Is Friend", isFriend)
                // console.log("Mutual State", mutualFriends)
                // setLoading(false)
            })
            .catch(error => {
                console.log("Error fetching mutual friends:", error);
            });
    };

    const checkRequest = async () => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/confirm/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "username": User
                },
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data?.isFriend) {
                    setIsFriend(true)
                }
                if (data?.isRequestSent) {
                    setHasRequested(true)
                }
                if (data?.isRequestReceived) {
                    setHasRecieved(true)
                }
            })
            .catch(error => {
                console.log("Error checking request:", error);
            });
    }

    useEffect(() => {
        checkRequest();
        getUser();
        getMutualFriends();

    }, [id]);

    const followUser = async () => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/send/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "id": ID
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("Follow User", data)
                if (data.status === 200) {
                    console.log("Request Sent")
                    isFriend(false)
                    hasRecieved(false)
                    hasRequested(true)
                }
            }).catch(error => {
                console.log("Error sending request:", error);
            });


    }

    const acceptRequest = async () => {
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
                    "username": publicuser.username
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    console.log("Accepted")
                    hasRequested(false)
                    hasRecieved(false)
                    isFriend(true)
                }
            })
            .catch(error => {
                console.log("Error accepting request:", error);
            });
    }

    const cancelRequest = async () => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/cancel/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "username": User
                },
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    console.log("Cancelled")
                    hasRequested(false)
                    isFriend(false)
                    hasRecieved(false)
                }
            })
            .catch(error => {
                console.log("Error cancelling request:", error);
            });
    }

    const unfriend = async () => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/unfriend/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Token}`
            },
            body: JSON.stringify({
                "user": {
                    "username": User
                },
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    console.log("Unfriended")
                    hasRequested(false)
                    isFriend(false)
                    hasRecieved(false)
                }
            })
            .catch(error => {
                console.log("Error unfriending:", error);
            });
    }



    const handleAction = (e) => {
        e.preventDefault();
        if (isFriend) {
            unfriend();
        } else if (hasRequested) {
            cancelRequest();
        } else if (hasRecieved) {
            acceptRequest();
        } else {
            followUser();
        }
        // Reload Page
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    if (publicuser == {}) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">User Not Found</h1>
            </div>
        )
    }

    return (
        <>
            {loading ? <Spinner screen={true} /> :
                <>
                    <Navbar />
                    <div className="flex flex-col justify-evenly overflow-hidden pt-5">
                        <div className="flex flex-col items-center ">
                            <div className="flex items-center">
                                <img
                                    src={publicuser.image}
                                    alt="Profile"
                                    className="md:h-40 md:w-40 h-32 w-32 rounded-full object-center object-cover"
                                />
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-2xl md:text-4xl font-bold ml-8 text-gray-900 mb-1">{publicuser.name.first} {publicuser.name.last}</h1>
                                    <div className={`flex justify-center items-center cursor-pointer md:text-lg font-normal w-40 ml-8 mt-1 text-gray-800 p-2 border-2 ${!hasRequested && !hasRecieved && !isFriend && "hover:bg-gray-200 md:w-28"} ${hasRequested && "bg-red-400 hover:bg-red-500 md:w-44"} ${hasRecieved && "bg-green-300 hover:bg-green-400 md:w-44"} ${isFriend && "hover:bg-gray-200 md:w-28"} rounded-lg`} onClick={handleAction}>
                                        {hasRequested && "Cancel Request"}
                                        {hasRecieved && "Accept Request"}
                                        {isFriend && "Unfriend"}
                                        {!hasRequested && !hasRecieved && !isFriend && "Follow"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between w-80 mt-8">
                                <div className="flex flex-col items-center">
                                    <p className="text-lg font-semibold text-gray-800">Friends</p>
                                    <p className="text-xl font-bold text-gray-600">{publicuser.noOfFriends}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-lg font-semibold text-gray-800">Mutuals</p>
                                    <p className="text-xl font-bold text-gray-600">{mutualFriends.length > 0 ? mutualFriends.length : 0}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-lg font-semibold text-gray-800">Posts</p>
                                    <p className="text-xl font-bold text-gray-600">{publicuser.noOfPosts}</p>
                                </div>
                            </div>
                            <p className="text-lg font-normal mt-8 max-w-screen-sm text-gray-800">
                                No bio provided yet
                            </p>
                        </div>
                        <Mutuals mode={'mutual'} mutualFriends={mutualFriends} />
                    </div>
                </>}
        </>
    );
}

export default User