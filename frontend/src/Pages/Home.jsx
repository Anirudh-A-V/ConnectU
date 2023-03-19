import Navbar from "../Components/Navbar"
import Cards from "../Components/Cards"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useStateContext } from "../Contexts/StateContext"
const Home = () => {

    const { users, setUsers } = useStateContext()
    const navigate = useNavigate()

    const Token = localStorage.getItem("token")

    const fetchUsers = async () => {
        const response = fetch(`${import.meta.env.VITE_API_URI}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const Users = data.users.filter((user) => {return user._id != localStorage.getItem("id").replace(/"/g, "")})
                setUsers(Users)
                // console.log(Users)
            })
    }

    useEffect(() => {
        if (Token == "") {
            navigate("/")
        }
        fetchUsers()
    }, [])

    return (
        <div className="flex justify-center items-center h-full flex-wrap">
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {users.map((user) => {
                    return (
                        <Cards slug={user._id} image={user.image} name={user.name} bio={user.bio}/>
                    )
                })}
            </div>
        </div>
    )
}

export default Home