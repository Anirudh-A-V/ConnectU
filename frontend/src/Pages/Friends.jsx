import Navbar from "../Components/Navbar"
import Cards from "../Components/Cards"
import { useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react"
import { StateContext } from "../Contexts/StateContext"

const Friends = () => {

    const { friends, setFriends, query, setQuery } = useContext(StateContext)
    const navigate = useNavigate()

    const Token = localStorage.getItem("token")
    const User = localStorage.getItem("user").replace(/"/g, "")

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
        const Friends = data.friends.filter((friend) => friend._id !== localStorage.getItem("id").replace(/"/g, ""))
        setFriends(Friends)
    }

    useEffect(() => {
        if (Token === "") {
            navigate("/")
        }
        fetchFriends()
    }, [])

    const filteredFriends = friends.filter((user) => {
        return user.name.first.toLowerCase().includes(query.toLowerCase()) || user.name.last.toLowerCase().includes(query.toLowerCase())
    })

    const handleSearch = (event) => {
        setQuery(event.target.value)
    }

    return (
        <div className="flex flex-col justify-center items-center h-full flex-wrap">
            <Navbar handleSearch={handleSearch} />
            {friends.length === 0 ? (
                <div className="flex justify-center items-center h-full flex-wrap">
                    <h1 className="text-3xl font-medium text-gray-700 mt-5">You have no friends</h1>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-semibold text-gray-700 mt-5">Friends</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                        {filteredFriends.map((user, index) => {
                            return (
                                <Cards key={index} slug={user._id} image={user.image} name={user.name} bio={user.bio} />
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

export default Friends
