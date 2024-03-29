import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Mutuals from "../Components/Mutuals";
import Spinner from "../Components/Spinner";
import { StateContext } from "../Contexts/StateContext";
import { useContext } from "react";

const Profile = () => {
    const [publicuser, setPublicUser] = useState({});
    const [loading, setLoading] = useState(true);

    const { friends, setFriends } = useContext(StateContext);

    const User = sessionStorage.getItem("user").replace(/['"]+/g, '')
    const ID = sessionStorage.getItem("id").replace(/['"]+/g, '')

    const Token = sessionStorage.getItem("token");

    const getUser = async () => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/getUser/${ID}`, {
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

    const fetchFriends = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/friends`, {
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
        const data = await response.json()
        console.log(data)
        const Friends = data.friends.filter((friend) => friend._id !== sessionStorage.getItem("id").replace(/"/g, ""))
        setFriends(Friends)
    }

    useEffect(() => {
        getUser();
        if (friends.length === 0) {
            fetchFriends()
        }
    }, []);

    if (publicuser == {}) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Something went wrong</h1>
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
                                    <div className={`flex justify-center items-center cursor-pointer md:text-lg font-normal w-40 ml-8 mt-1 text-gray-800 p-2 border-2 hover:bg-gray-50 rounded-lg`} onClick={() => {}}>
                                        Edit Profile
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
                                    <p className="text-xl font-bold text-gray-600">{friends.length > 0 ? friends.length : 0}</p>
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
                        <Mutuals mode={'friends'} mutualFriends={friends} />
                    </div>
                </>}
        </>
    );
}

export default Profile