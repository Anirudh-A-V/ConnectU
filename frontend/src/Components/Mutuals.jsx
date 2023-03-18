import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const Mutuals = (props) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
            <div className=" flex items-center justify-start">
                <button className="h-10 w-10 bg-gray-50 text-gray-500 flex items-center justify-center" onClick={leftScroll}>
                    <BiChevronLeft className="h-8 w-8" />
                </button>
                <div className='flex overflow-x-scroll' id='mutuals'>
                    {numbers.map((number) =>
                        <div class="min-w-[240px] w-52 bg-white rounded-xl h-60 flex flex-col justify-center mx-2 items-center border cursor-pointer" onClick={() => { }}>
                            <div class="mb-8">
                                <img class="object-center object-cover rounded-full h-24 w-24" src='https://images.unsplash.com/photo-1585076800246-4562eb6d6f42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=463&q=80' alt="photo" />
                            </div>
                            <div class="text-center">
                                <p class="text-xl text-gray-700 font-bold mb-2">John Doe</p>
                                <p class="text-base text-gray-400 font-normal">No bio yet</p>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={rightScroll} className="h-10 w-10 bg-gray-50 text-gray-500 flex items-center justify-center">
                    <BiChevronRight className="h-8 w-8" />
                </button>
            </div>
        </div>
    );
};

export default Mutuals;
