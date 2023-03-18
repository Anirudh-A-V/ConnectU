import { useNavigate } from "react-router-dom";

const Cards = (props) => {
    const navigate = useNavigate();
    return (
        <div class="w-full bg-white rounded-xl p-12 flex flex-col justify-center items-center border cursor-pointer" onClick={() => {navigate(`${props.slug}`)}}>
            <div class="mb-8">
                <img class="object-center object-cover rounded-full h-36 w-36" src={`${props.image}`} alt="photo" />
            </div>
            <div class="text-center">
                <p class="text-xl text-gray-700 font-bold mb-2">{props.name.first} {props.name.last}</p>
                <p class="text-base text-gray-400 font-normal">{props.bio}</p>
            </div>
        </div>
    )
}

export default Cards