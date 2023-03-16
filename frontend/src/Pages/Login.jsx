import './styles.css'

const Login = () => {
    return (
        <div className="App flex">
            <div className="bg-image w-full h-screen">
                {/* <img
                  src={bgImage}
                  className="w-full h-screen object-cover"
                /> */}
            </div>
            <div className="login-box flex flex-col items-center justify-center w-1/2 min-h-screen border">
                {/* <div className="logo flex w-full items-center justify-start mb-14">
                  <FaConnectdevelop className="h-14 w-14 ml-5" />
                </div> */}
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
                {/* <div className="input-fields w-[75%]">
                  <div className="email-field flex flex-col items-start justify-center">
                    <label className="text-[#3640b3] font-normal text-base">Email</label >
                    <input type="email" className="border-gray-300 h-7 outline-gray-300 rounded-md w-4/5"/>
                  </div>
                  <div className="password-field flex flex-col items-start justify-center">
                    <label>password</label>
                    <input type="password" />
                  </div>
                </div> */}
                <div class="flex justify-center">
                    <div>
                        <div class="relative mb-6 xl:w-96">
                            <input
                                type="email"
                                class="peer m-0 block h-[58px] w-full rounded border border-solid border-neutral-300 bg-white bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]"
                                id="floatingInput"
                                placeholder="name@example.com"
                            />
                            <label
                                for="floatingInput"
                                class="pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 text-neutral-600 transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none"
                            >
                                Email address
                            </label>
                        </div>
                        <div class="relative mb-3 xl:w-96">
                            <input
                                type="password"
                                class="peer m-0 block h-[58px] w-full rounded border border-solid border-neutral-300 bg-white bg-clip-padding py-4 px-3 text-base font-normal leading-tight text-neutral-600 ease-in-out placeholder:text-transparent focus:border-primary focus:bg-white focus:pt-[1.625rem] focus:pb-[0.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  [&:not(:placeholder-shown)]:pt-[1.625rem] [&:not(:placeholder-shown)]:pb-[0.625rem]"
                                id="floatingPassword"
                                placeholder="Password"
                            />
                            <label
                                for="floatingPassword"
                                class="pointer-events-none absolute top-0 left-0 origin-[0_0] border border-solid border-transparent py-4 px-3 text-neutral-600 transition-[opacity,_transform] duration-100 ease-in-out peer-focus:translate-x-[0.15rem] peer-focus:-translate-y-2 peer-focus:scale-[0.85] peer-focus:opacity-[0.65] peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:opacity-[0.65] motion-reduce:transition-none"
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
                    <p className="text-xs font-light text-[#1487df] cursor-pointer">Forgot password?</p>
                </div>
                <div className="font-medium text-md p-4 mt-6 w-4/5 h-10 bg-transparent border text-[#222221] hover:bg-[#040404] hover:text-[#f9f9f5] border-black transition duration-150 ease-in-out rounded-md flex justify-center items-center">Login</div>
                <div className="flex mt-4"><p className="text-sm font-light flex mr-1">Don't have an account?</p> <p className="text-sm font-light text-[#1486de] hover:text-[#096ab5] cursor-pointer">Sign Up</p></div>
            </div>
        </div>
    )
}

export default Login