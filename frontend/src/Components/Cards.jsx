import { useNavigate } from "react-router-dom";

const Cards = (props) => {
    const navigate = useNavigate();
    return (
        <div className="w-full bg-white rounded-xl p-12 flex flex-col justify-center items-center border cursor-pointer" onClick={() => {navigate(`/in/${props.slug}`)}}>
            <div className="mb-8">
                <img className="object-center object-cover rounded-full h-36 w-36" src={`${props.image}`} alt="photo" />
            </div>
            <div className="text-center">
                <p className="text-xl text-gray-700 font-bold mb-2">{props.name.first} {props.name.last}</p>
                <p className="text-base text-gray-400 font-normal">{props.bio}</p>
            </div>
        </div>
    )
}

export default Cards