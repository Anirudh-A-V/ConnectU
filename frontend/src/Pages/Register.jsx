import './styles.css'
import Login from './Login'
import Signup from './Signup'
import { useState } from 'react'
import { useStateContext } from '../Contexts/StateContext'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../Firebase/config'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [login, setLogin] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");

    const navigate = useNavigate();

    const { token, setToken, user, setUser } = useStateContext();

    const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'];


    const handleFileInputChange = (event) => {
        if (event.target.files[0] && types.includes(event.target.files[0].type)) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleFirstNameInputChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameInputChange = (event) => {
        setLastName(event.target.value);
    };

    const handleEmailInputChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
    };

    const getUserName = () => {
        return email.split("@")[0];
    }

    const handleUpload = () => {
        if (selectedFile == null) {
            return;
        }
        const storageRef = ref(storage, `images/${selectedFile.name}`);

        const uploadImage = uploadBytesResumable(storageRef, selectedFile);

        uploadImage.on('state_changed', (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            console.log(percentage);
            // setProgress(percentage);

        }, (err) => {
            console.log(err);
        }, async () => {
            await getDownloadURL(uploadImage.snapshot.ref).then((URL) => {
                console.log(URL);
                const data = {
                    url: URL
                }
                setUrl(URL);
                console.log(data);
            });
        })
    }

    const handleLogin = () => {
        const API = "http://localhost:3000/login"

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
                setToken(data.token);
                console.log(token)
                setUser(data.user);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user.username));
                if (localStorage.getItem("token") != null) {
                    navigate("/home");
                } else {
                    alert("Something went wrong");
                }
                // if (data.token != null) {
                //     navigate("/home");
                // } else {
                //     alert("Something went wrong");
                // }
            })
            .catch((error) => {
                console.error('Error:', error);
            });


    }

    const handleSignup = () => {
        const API = "http://localhost:3000/signup"

        handleUpload();

        console.log(url);

        setTimeout(() => {
            const result = fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": {
                        "first": firstName,
                        "last": lastName
                    },
                    "username": getUserName(),
                    "password": password,
                    "email": email,
                    "image": url
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setToken(data.token);
                    localStorage.setItem("token", data.token);
                    if (data.token != null) {
                        navigate("/home");
                    } else {
                        alert("Something went wrong");
                    }
                })

                .catch((error) => {
                    console.error('Error:', error);
                });

        }, 2000);


    };


    return (
        <div className="App flex">
            <div className="bg-image w-full h-screen">
            </div>
            {login ? (
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
            ) : (
                <div className="login-box flex flex-col items-center justify-center w-1/2 min-h-screen border">
                    <div className="m-8 flex flex-col items-center justify-center">
                        <h1 className="font-medium text-4xl text-[#151414]">
                            Get Started{" "}
                            <span role="img" aria-label="">
                                👍
                            </span>
                        </h1>
                        <p className="font-normal flex text-xs text-[#757373] m-2">
                            Create an Account now
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <div>
                            <div className="flex justify-between">
                                <div className="relative mb-6 xl:w-44">
                                    <input
                                        type="text"
                                        className="peer m-0 block h-[58px] w-full rounded border border-solid border-neutral-300 bg-white bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                        onChange={handleFirstNameInputChange}
                                    />
                                    <label
                                        htmlFor="floatingInput"
                                        className="pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 text-neutral-600 transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none"
                                    >
                                        First Name
                                    </label>
                                </div>
                                <div className="relative mb-6 xl:w-44">
                                    <input
                                        type="text"
                                        className="peer m-0 block h-[58px] w-full rounded border border-solid border-neutral-300 bg-white bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                        onChange={handleLastNameInputChange}
                                    />
                                    <label
                                        htmlFor="floatingInput"
                                        className="pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 text-neutral-600 transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none"
                                    >
                                        Last Name
                                    </label>
                                </div>
                            </div>
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
                            <div className="relative mb-3 xl:w-96">
                                <div className="w-full border border-gray-300 rounded-lg flex items-center">
                                    <label className="flex items-center justify-center text-sm font-medium text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none w-40 h-10" htmlFor="file_input">Upload file</label>
                                    <input className=" w-full text-sm hidden text-gray-800 border hover:bg-gray-600 border-gray-300 rounded-lg cursor-pointer bg-gray-500 focus:outline-none" aria-describedby="file_input_help" id="file_input" type="file" onChange={handleFileInputChange} />
                                    <div className="w-full flex items-center justify-center">
                                        {selectedFile && <p className="text-sm text-gray-700">{selectedFile.name}</p>}
                                    </div>
                                </div>

                                <p className="mt-1 text-sm text-gray-500" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>

                            </div>
                        </div>
                    </div>
                    <div className="font-medium text-md p-4 mt-6 w-4/5 h-10 bg-transparent border text-[#222221] hover:bg-[#040404] hover:text-[#f9f9f5] border-black transition duration-150 ease-in-out rounded-md flex justify-center items-center cursor-pointer"
                        onClick={handleSignup}
                    >
                        Sign Up
                    </div>
                    <div className="flex mt-4">
                        <p className="text-sm font-light flex mr-1">
                            Have an account?
                        </p>{" "}
                        <div className="text-sm font-light text-[#1486de] hover:text-[#096ab5] cursor-pointer" onClick={() => setLogin(true)}>
                            Login
                        </div>
                    </div>
                </div>
            )}
            {/* {login ? (<Login setLogin={setLogin} />) : (<Signup setLogin={setLogin} />)} */}
        </div>
    )
}

export default Register