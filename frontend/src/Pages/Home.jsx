import Navbar from "../Components/Navbar"
import Cards from "../Components/Cards"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useStateContext } from "../Contexts/StateContext"
const Home = () => {

    const { token, users, setUsers } = useStateContext()
    const navigate = useNavigate()

    const Token = localStorage.getItem("token")

    const fetchUsers = async () => {
        const response = fetch("http://localhost:3000/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setUsers(data.users)
                console.log(data.users)
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
                {/* <Cards slug="/" />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards /> */}
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