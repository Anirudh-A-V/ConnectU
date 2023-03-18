import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Mutuals from "../Components/Mutuals";

const User = () => {
    const { id } = useParams();
    const [publicuser, setPublicUser] = useState({});
    const [hasRequested, setHasRequested] = useState(false);
    const [hasRecieved, setHasRecieved] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [mutualFriends, setMutualFriends] = useState([]);

    const User = localStorage.getItem("user");

    const Token = localStorage.getItem("token");

    useEffect(() => {
        const getUser = async () => {
            const response = fetch(`http://localhost:3000/getUser/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPublicUser(data.user)
                    console.log("State", publicuser)
                    if (data.user.requests.from.includes(User._id)) {
                        setHasRequested(true)
                    }
                    if (data.user.requests.to.includes(User._id)) {
                        setHasRecieved(true)
                    }
                    if (data.user.friends.includes(User._id)) {
                        setIsFriend(true)
                    }
                })
        };

        const getMutualFriends = async () => {
            const response = fetch(`http://localhost:3000/mutual/${publicuser.username}`, {
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
                    setMutualFriends(data.users)
                    console.log("State", mutualFriends)
                })
        };
        getUser();
        getMutualFriends();

    }, []);

    const followUser = async () => {
        const response = fetch(`http://localhost:3000//send/${id}`, {
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
                    console.log("Followed")
                }
            })
    }

    const acceptRequest = async () => {
        const response = fetch(`http://localhost:3000/accept`, {
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
                }
            })
    }

    const cancelRequest = async () => {
        const response = fetch(`http://localhost:3000/cancel/${publicuser.username}`, {
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
                }
            })
    }

    const unfriend = async () => {
        const response = fetch(`http://localhost:3000/unfriend/${publicuser.username}`, {
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
                }
            })
    }



    const handleAction = () => {
        if (hasRequested) {
            cancelRequest()
        } else if (hasRecieved) {
            acceptRequest()
        } else if (isFriend) {
            unfriend()
        } else {
            followUser()
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-evenly overflow-hidden pt-5">
                <div className="flex flex-col items-center ">
                    <div className="flex items-center">
                        <img
                            src={'https://images.unsplash.com/photo-1585076800246-4562eb6d6f42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=463&q=80'}
                            alt="Profile"
                            className="h-40 w-40 rounded-full object-center object-cover"
                        />
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl font-bold ml-8 text-gray-900 mb-1">John Doe</h1>
                            <div className=" flex justify-center items-center cursor-pointer w-28 text-lg font-normal ml-8 mt-1 text-gray-800 p-2 border-2 hover:bg-gray-200 rounded-lg" onClick={handleAction}>
                                {hasRequested ? "Requested" : hasRecieved ? "Accept" : isFriend ? "Friends" : "Follow"}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-80 mt-8">
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold text-gray-800">Followers</p>
                            <p className="text-xl font-bold text-gray-600">1,000</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold text-gray-800">Mutuals</p>
                            <p className="text-xl font-bold text-gray-600">123</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold text-gray-800">Posts</p>
                            <p className="text-xl font-bold text-gray-600">0</p>
                        </div>
                    </div>
                    <p className="text-lg font-normal mt-8 max-w-screen-sm text-gray-800">
                        No bio provided yet
                    </p>
                </div>
                <Mutuals mutualFriends={mutualFriends} />
            </div>
        </>
    );
}

export default User