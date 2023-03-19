import './styles.css'
import Login from './Login'
import Signup from './Signup'
import { useStateContext } from '../Contexts/StateContext'

const Register = () => {
    
    const { login } = useStateContext();

    return (
        <div className="App flex">
            <div className="bg-image w-full h-screen">
            </div>
            {login ? (<Login />) : (<Signup />)}
        </div>
    )
}

export default Register