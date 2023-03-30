import './styles.css'
import Login from './Login'
import Signup from './Signup'
import { useStateContext } from '../Contexts/StateContext'
import { SiQuantconnect } from 'react-icons/si'
import { useEffect, useState } from 'react'

const Register = () => {

    const { login } = useStateContext();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        setWindowWidth(windowWidth);
    }, [window.innerWidth])

    return (
        <div className="App flex">
            {windowWidth > 768 ? (
                <>
                    <div className="bg-image w-full h-screen">
                        <div className="flex justify-center mt-56 w-full">
                            <div className="flex items-center justify-center w-fit h-fit blur-s">
                                <SiQuantconnect className="text-9xl z-10 text-[#e2e0e0] mr-4 " />
                                <h1 className="text-8xl font-bold text-[#e2e0e0]">ConnectU</h1>
                            </div>
                        </div>
                    </div>
                    {login ? (<Login />) : (<Signup />)}
                </>
            ) : (
                <div className="bg-image flex items-center justify-center w-full h-screen">
                    {login ? (<Login />) : (<Signup />)}
                </div>
            )}
        </div>
    )
}

export default Register