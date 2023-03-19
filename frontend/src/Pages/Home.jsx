import Navbar from "../Components/Navbar"
import Cards from "../Components/Cards"
import { useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react"
import { StateContext } from "../Contexts/StateContext"

const Home = () => {

    const { users, setUsers, query, setQuery } = useContext(StateContext)
    const navigate = useNavigate()

    const Token = localStorage.getItem("token")

    const fetchUsers = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Token}`
            }
        })
        const data = await response.json()
        console.log(data)
        const Users = data.users.filter((user) => user._id !== localStorage.getItem("id").replace(/"/g, ""))
        setUsers(Users)
    }

    useEffect(() => {
        if (Token === "") {
            navigate("/")
        }
        fetchUsers()
    }, [])

    const filteredUsers = users.filter((user) => {
        return user.name.first.toLowerCase().includes(query.toLowerCase()) || user.name.last.toLowerCase().includes(query.toLowerCase())
    })

    const handleSearch = (event) => {
        setQuery(event.target.value)
    }

    return (
        <div className="flex justify-center items-center h-full flex-wrap">
            <Navbar handleSearch={handleSearch} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {filteredUsers.map((user, index) => {
                    return (
                        <Cards key={index} slug={user._id} image={user.image} name={user.name} bio={user.bio}/>
                    )
                })}
            </div>
        </div>
    )
}

export default Home
