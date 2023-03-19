import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Mutuals = (props) => {

    const leftScroll = () => {
        const container = document.getElementById('mutuals');
        console.log(container.scrollLeft);
        container.scrollLeft -= 200;
    }

    const rightScroll = () => {
        const container = document.getElementById('mutuals');
        console.log(container.scrollLeft);
        container.scrollLeft += 200;
    }

    return (
        <div className="relative mt-4 w-full h-full flex flex-col justify-center">
            <div className="flex flex-col justify-center items-center">
                <div className="w-[80%] h-[1px] bg-gray-300 "></div>
                <p className="text-xl font-normal text-gray-800 mt-2 mb-3">Mutuals</p>
            </div>
            {props.mutualFriends.length > 0 ?
                <div className=" flex items-center justify-between">
                    <button className="h-10 w-10 bg-gray-50 text-gray-500 flex items-center justify-center" onClick={leftScroll}>
                        <BiChevronLeft className="h-8 w-8" />
                    </button>
                    <div className='flex w-full overflow-x-scroll' id='mutuals'>
                        {props.mutualFriends.map((friend) =>
                            <Link to={`/in/${friend._id}`}>
                                <div class="min-w-[240px] w-52 bg-white rounded-xl h-60 flex flex-col justify-center mx-2 items-center border cursor-pointer">
                                    <div class="mb-8">
                                        <img class="object-center object-cover rounded-full h-24 w-24" src={friend.image} alt="photo" />
                                    </div>
                                    <div class="text-center">
                                        <p class="text-xl text-gray-700 font-bold mb-2">{friend.name.first} {friend.name.last}</p>
                                        <p class="text-base text-gray-400 font-normal">{friend.bio}</p>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                    <button onClick={rightScroll} className="h-10 w-10 bg-gray-50 text-gray-500 flex items-center justify-center">
                        <BiChevronRight className="h-8 w-8" />
                    </button>
                </div>
                :
                <div className="flex flex-col justify-center items-center">
                    <p className="text-lg font-normal text-gray-600 mb-3">No mutuals</p>
                </div>
            }
        </div>
    );
};

export default Mutuals;
