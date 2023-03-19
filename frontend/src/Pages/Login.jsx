import { useStateContext } from "../Contexts/StateContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { setLogin } = useStateContext();

    const { setToken, firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword } = useStateContext();

    const navigate = useNavigate();

    const handleEmailInputChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
    };

    const getUserName = () => {
        return email.split("@")[0];
    }

    const handleLogin = () => {
        const API = `${import.meta.env.VITE_API_URI}/login`

        const result = fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": getUserName(),
                "password": password
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                console.log(token)
                if (data.token){
                    setToken(data.token);
                    setUser(data.user);
                    if (import.meta.env.MODE === 'development') {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user.username));
                        localStorage.setItem("id", JSON.stringify(data.user._id));
                    }
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("user", JSON.stringify(data.user.username));
                    sessionStorage.setItem("id", JSON.stringify(data.user._id));
                }

                if (sessionStorage.getItem("token") != null) {
                    navigate("/home");
                } else {
                    alert("Something went wrong");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="login-box flex flex-col items-center justify-center w-1/2 min-h-screen border">
                    <div className="m-8">
                        <h1 className="font-medium text-4xl text-[#151414]">
                            Hey there{" "}
                            <span role="img" aria-label="">
                                👋
                            </span>
                        </h1>
                        <p className="font-normal text-xs text-[#757373] m-2">
                            Enter the information you entered while registering
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div>
                            <div className="relative mb-6 xl:w-96">
                                <input
                                    type="email"
                                    className="peer m-0 block h-[58px] w-full rounded border border-solid border-neutral-300 bg-white bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    onChange={handleEmailInputChange}
                                />
                                <label
                                    htmlFor="floatingInput"
                                    className="pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 text-neutral-600 transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none"
                                >
                                    Email address
                                </label>
                            </div>
                            <div className="relative mb-3 xl:w-96">
                                <input
                                    type="password"
                                    className="peer m-0 block h-[58px] w-full rounded border border-solid border-neutral-300 bg-white bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    onChange={handlePasswordInputChange}
                                />
                                <label
                                    htmlFor="floatingPassword"
                                    className="pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 text-neutral-600 transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none"
                                >
                                    Password
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="buttons flex w-4/5 items-center justify-between mt-3">
                        <div className="flex cursor-pointer">
                            <input type="checkbox" className="mr-1 cursor-pointer" />
                            <label className="text-xs font-semibold text-[#272727] cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <p className="text-xs font-light text-[#1487df] cursor-pointer">
                            Forgot password?
                        </p>
                    </div>
                    <div className="font-medium text-md p-4 mt-6 w-4/5 h-10 bg-transparent border text-[#222221] hover:bg-[#040404] hover:text-[#f9f9f5] border-black transition duration-150 ease-in-out rounded-md flex justify-center items-center cursor-pointer"
                        onClick={handleLogin}
                    >
                        Login
                    </div>
                    <div className="flex mt-4">
                        <p className="text-sm font-light flex mr-1">
                            Don't have an account?
                        </p>{" "}
                        <p className="text-sm font-light text-[#1486de] hover:text-[#096ab5] cursor-pointer" onClick={() => setLogin(false)}>
                            Sign Up
                        </p>
                    </div>
                </div>
    )
}

export default Login