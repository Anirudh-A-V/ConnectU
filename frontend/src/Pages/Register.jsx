import './styles.css'
import Login from './Login'
import Signup from './Signup'
import { useStateContext } from '../Contexts/StateContext'

const Register = () => {

    const { login } = useStateContext();

    return (
        <div className="App flex">
            {window.innerWidth > 768 ? (
                <>
                    <div className="bg-image w-full h-screen">
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