import React, { useEffect, useState } from "react"; // Tidak perlu useState jika hanya digunakan di komponen induk
import logo from "../../assets/logoFIX.png";
import container from "../../assets/container.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import api from "../../instance/api";

const LoginView = ({ setShowPassword, showPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    return () => {
      const token = localStorage.getItem("token");
      if (token) {
        window.location.href = "/dashboard";
      }
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    api.post('/user/login', {
      email: email,
      password: password
    })
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "/beranda";
    })
    .catch((error) => {
      console.error("Login failed:", error);
    });
  }
  return (
    <main className="relative flex min-h-[140vh] md:p-2">
      <header className="absolute top-4 left-4">
        <img
          src={logo}
          alt="Logo Perusahaan"
          className="w-[50px] md:w-[70px]"
        />
      </header>
      <section
        className="flex flex-1 justify-center items-center w-full md:w-1/2 lg:w-1/2 px-4 sm:px-6 lg:px-8"
        aria-labelledby="login-heading"
      >
        <div className="w-full max-w-[400px]">
          <h1
            id="login-heading"
            className="text-3xl md:text-[40px] font-bold font-inter text-center lg:text-left"
          >
            Login
          </h1>
          <p className="text-[18px] font-normal font-inter text-[#969696] mt-2 text-center lg:text-left">
            Please login to continue to your account.
          </p>
          <form className="mt-3 flex flex-col space-y-[20px]">
            <div className="relative">
              <input
                type="email"
                id="email_input"
                className="block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="default_outlined"
                className="absolute text-[18px] font-medium font-inter text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[14px]"
              >
                Email
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password_input"
                className="block px-2.5 pb-2.5 pt-4 w-full h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10"
                placeholder=" "
                required
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password_input"
                className="absolute text-[18px] font-medium font-inter text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[14px]"
              >
                Password
              </label>
              <button
                type="button"
                className="absolute z-10 top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Icon
                    icon="mdi:eye-off"
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon icon="mdi:eye" className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="keep_logged_in"
                className="w-[18px] h-[18px] border border-black rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="keep_logged_in"
                className="text-[16px] font-medium text-gray-900 font-inter"
              >
                Keep me logged in
              </label>
            </div>
            <div className="flex flex-col items-center space-y-4 w-full pt-4">
              <button
                type="submit"
                onClick={(e) => handleLogin(e)}
                className="w-full font-inter h-[54px] bg-[#367AFF] text-white text-[18px] font-semibold rounded-[10px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Login
              </button>
              <div className="flex items-center w-full">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="px-3 text-gray-500 text-sm font-medium font-inter">
                  or
                </span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <button
                type="button"
                className="w-full h-[54px] border border-[#E6E8E7] rounded-[10px] flex items-center justify-center space-x-2 text-lg font-medium font-inter text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                <Icon
                  icon="flat-color-icons:google"
                  className="text-xl"
                  aria-hidden="true"
                />
                <span>Continue with Google</span>
              </button>
            </div>
          </form>
          <p className="text-gray-500 text-[16px] font-medium font-inter text-center mt-[32px]">
            Need an account?{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold font-inter underline hover:text-blue-800"
            >
              Create one
            </a>
          </p>
        </div>
      </section>
      <aside
        className="hidden lg:flex justify-center items-center w-1/2"
        aria-hidden="true"
      >
        <img
          src={container}
          alt="Decorative container illustration"
          className="w-full h-full object-cover rounded-[16px]"
        />
      </aside>
    </main>
  );
};

export default LoginView;
