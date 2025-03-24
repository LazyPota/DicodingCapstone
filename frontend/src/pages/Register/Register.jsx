import React, { useState } from "react";
import logo from "../../assets/logo.png";
import container from "../../assets/container.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="relative flex min-h-[140vh] p-2">
      <img src={logo} alt="logo" className="absolute top-4 left-4 w-[70px]" />

      {/* Bagian kiri (form) */}
      <div className="flex flex-1 justify-center items-center">
        <div className="w-[400px]">
          <h1 className="text-[40px] font-bold">Sign Up</h1>
          <p className="text-[18px] font-normal text-[#969696] mt-1">
            Sign up to enjoy the feature of Revolutie
          </p>
          <form className="mt-3 flex flex-col space-y-[20px]">
            <div className="relative">
              <input
                type="text"
                id="default_outlined"
                className="block px-2.5 pb-2.5 pt-4 w-[399px] h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="default_outlined"
                className="absolute text-[18px] font-medium text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[14px]"
              >
                Your Name
              </label>
            </div>
            <div className="relative">
              <Icon
                icon="mdi:calendar"
                className="absolute left-3 top-[55%] -translate-y-1/2 text-gray-500 w-5 h-5"
              />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd MMMM yyyy"
                placeholderText=" "
                className="peer block pl-10 pr-2.5 pb-2.5 pt-4 w-[399px] font-medium h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
              />
              <label
                for="default_outlined"
                className="absolute font-medium text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[14px]"
              >
                Date of Birth
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="default_outlined"
                className="block px-2.5 pb-2.5 pt-4 w-[399px] h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="default_outlined"
                className="absolute text-[18px] font-medium text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[14px]"
              >
                Email
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password_input"
                className="block px-2.5 pb-2.5 pt-4 w-[399px] h-[59px] text-sm text-gray-900 bg-transparent rounded-[10px] border border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10"
                placeholder=" "
              />
              <label
                htmlFor="password_input"
                className="absolute text-[18px] font-medium text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[14px]"
              >
                Password
              </label>
              <button
                type="button"
                className="absolute z-10 top-1/2 ml-[360px] -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Icon icon="mdi:eye-off" className="w-5 h-5" />
                ) : (
                  <Icon icon="mdi:eye" className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4 w-[399px]">
              <button className="w-full h-[54px] bg-[#367AFF] text-white text-[18px] font-semibold rounded-[10px]">
                Sign up
              </button>

              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm font-medium">
                  or
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <button className="w-full h-[54px] border border-[#E6E8E7] rounded-[10px] flex items-center justify-center space-x-2 text-lg font-medium text-gray-900">
                <span>Continue with Google</span>
                <span className="text-xl">
                  <Icon icon="flat-color-icons:google" />
                </span>
              </button>
            </div>
          </form>
          <p className="text-gray-500 text-[16px] font-medium text-center mt-[32px]">
            Already have an account??{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Bagian kanan (gambar) */}
      <div className="w-[50%]">
        <img src={container} alt="container" className="w-full h-[140vh]" />
      </div>
    </div>
  );
};

export default Register;
