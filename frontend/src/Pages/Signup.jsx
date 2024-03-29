import { useStateContext } from "../Contexts/StateContext";
import { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../Firebase/config'
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const { setLogin, setToken, firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, user, setUser } = useStateContext();

    const [selectedFile, setSelectedFile] = useState(null);
    const [smallScreen, setSmallScreen] = useState(false);
    const [url, setUrl] = useState("");

    const [noImage, setNoImage] = useState(false);
    const [emptyFirstName, setEmptyFirstName] = useState(false);
    const [emptyLastName, setEmptyLastName] = useState(false);
    const [emptyEmail, setEmptyEmail] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);

    const navigate = useNavigate();

    const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'];

    const handleFileInputChange = (event) => {
        if (event.target.files[0] && types.includes(event.target.files[0].type)) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = () => {
        if (selectedFile == null) {
            setNoImage(true);
            return;
        }

        if (firstName === "" || lastName === "" || email === "" || password === "") {
            if (firstName === "") {
                setEmptyFirstName(true);
            }
            if (lastName === "") {
                setEmptyLastName(true);
            }
            if (email === "") {
                setEmptyEmail(true);
            }
            if (password === "") {
                setEmptyPassword(true);
            }
            return;
        }

        if (!ValidateEmail(email)) {
            alert("Please enter a valid email address");
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

    const handleSignup = () => {
        handleUpload();
    };

    function ValidateEmail(inputText) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(email);
        return isValidEmail;
    }

    useEffect(() => {
        const Signup = async () => {
            const API = `${import.meta.env.VITE_API_URI}/signup`;

            try {
                console.log(url);

                const response = await fetch(API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: {
                            first: firstName,
                            last: lastName,
                        },
                        username: getUserName(),
                        password: password,
                        email: email,
                        image: url,
                    }),
                });

                const data = await response.json();
                console.log(data.result);
                console.log(data.result._id);

                const image = data.result.image || null;

                const username = data.result.username;
                const id = data.result._id;

                if (data.token != null) {
                    setToken(data.token);
                    setUser(data.result);
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("user", JSON.stringify(username));
                    sessionStorage.setItem("id", JSON.stringify(id));
                    if (image !== null) {
                        sessionStorage.setItem("image", JSON.stringify(image));
                    }
                    navigate("/home");
                } else {
                    alert("Something went wrong");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        if (url !== "") {
            Signup();
        }
    }, [url]);

    useEffect(() => {
        if (selectedFile != null) {
            setNoImage(false);
        }
    }, [selectedFile]);

    useEffect(() => {
        if (firstName !== "") {
            setEmptyFirstName(false);
        } 
        if (lastName !== "") {
            setEmptyLastName(false);
        } 
        if (email !== "") {
            setEmptyEmail(false);
        } 
        if (password !== "") {
            setEmptyPassword(false);
        }
    }, [firstName, lastName, email, password]);


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

    useEffect(() => {
        if (window.innerWidth < 768) {
            setSmallScreen(true);
        } else {
            setSmallScreen(false);
        }
    }, []);

    return (
        <div className={`login-box flex flex-col items-center justify-center w-96 ${smallScreen && "bg-white w-[95vw] p-2 rounded-lg min-h-fit"} md:w-1/2 md:min-h-screen border`}>
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
                                className={`peer m-0 block h-[58px] w-full rounded border border-solid ${emptyFirstName ? "border-red-300 bg-red-50 " : "border-neutral-300 bg-white "} bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]`}
                                id="floatingFirstName"
                                placeholder="name@example.com"
                                onChange={handleFirstNameInputChange}
                            />
                            <label
                                htmlFor="floatingFirstName"
                                className={`pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 ${emptyFirstName ? "text-red-600" : "text-neutral-600"} transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none`}
                            >
                                First Name
                            </label>
                        </div>
                        <div className="relative mb-6 xl:w-44">
                            <input
                                type="text"
                                className={`peer m-0 block h-[58px] w-full rounded border border-solid ${emptyLastName ? "border-red-300 bg-red-50 " : "border-neutral-300 bg-white "} bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]`}
                                id="floatingLastName"
                                placeholder="name@example.com"
                                onChange={handleLastNameInputChange}
                            />
                            <label
                                htmlFor="floatingLastName"
                                className={`pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 ${emptyLastName ? "text-red-600" : "text-neutral-600"} transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none`}
                            >
                                Last Name
                            </label>
                        </div>
                    </div>
                    <div className="relative mb-6 xl:w-96">
                        <input
                            type="email"
                            className={`peer m-0 block h-[58px] w-full rounded border border-solid  ${emptyEmail ? "border-red-300 bg-red-50 " : "border-neutral-300 bg-white "} bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]`}
                            id="floatingEmailSignUp"
                            placeholder="name@example.com"
                            onChange={handleEmailInputChange}
                        />
                        <label
                            htmlFor="floatingEmailSignUp"
                            className={`pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 ${emptyEmail ? "text-red-600" : "text-neutral-600"} transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none`}
                        >
                            Email address
                        </label>
                    </div>
                    <div className="relative mb-3 xl:w-96">
                        <input
                            type="password"
                            className={`peer m-0 block h-[58px] w-full rounded border border-solid  ${emptyPassword ? "border-red-300 bg-red-50 " : "border-neutral-300 bg-white "} bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]`}
                            id="floatingPasswordSignUp"
                            placeholder="Password"
                            onChange={handlePasswordInputChange}
                        />
                        <label
                            htmlFor="floatingPasswordSignUp"
                            className={`pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 ${emptyPassword ? "text-red-600" : "text-neutral-600"} transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none`}
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative mb-3 xl:w-96">
                        <div className={`w-full border ${noImage ? "border-red-300" : "border-gray-300"} rounded-lg flex items-center`}>
                            <label className={`flex items-center justify-center text-sm font-medium  border  rounded-lg cursor-pointer ${noImage ? "bg-red-100 text-red-900 border-red-300" : "bg-gray-100 border-gray-300 text-gray-900"} focus:outline-none w-40 h-10`} htmlFor="file_input">Upload file</label>
                            <input className={`w-full text-sm hidden text-gray-800 border hover:bg-gray-600 border-gray-300 bg-gray-500 focus:outline-none rounded-lg cursor-pointer`} aria-describedby="file_input_help" id="file_input" type="file" onChange={handleFileInputChange} />
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
    )
}

export default Signup;